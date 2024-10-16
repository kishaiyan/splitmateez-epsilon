import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
import os

# Initialize AWS SDK clients
rekognition_client = boto3.client('rekognition')
cloudwatch_logs_client = boto3.client('logs')
s3_client = boto3.client('s3')


TEMP_BUCKET = 'tempbucketsplitmate'
PERMANENT_BUCKET = 'photidtenants'
LOG_GROUP = 'TenantActivityLogs'


# Main lambda handler
def lambda_handler(event, context):
    try:
        # Get the uploaded frame key from the Temp-S3 bucket (event-triggered)
        frame_key = event['Records'][0]['s3']['object']['key']
        
        # Compare faces in the frame with permanent faces
        tenant_id = compare_faces_with_tenants(TEMP_BUCKET, frame_key)
        print(f"Tenant_ID Detected: {tenant_id}")
        
        # If a tenant is identified, analyze the light status and log activity
        if tenant_id:
            detect_light_activity_using_brightness(TEMP_BUCKET, frame_key, tenant_id)
            detect_cooking_activity(TEMP_BUCKET, frame_key, tenant_id) 
        return {
            'statusCode': 200,
            'body': json.dumps('Face detection and activity logging completed successfully!')
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error in processing!')
        }

# Compare faces in the uploaded frame with stored tenant images in Permanent-S3
def compare_faces_with_tenants(source_bucket, source_key):
    try:
        # List all images from the Permanent-S3 bucket
        s3_objects = s3_client.list_objects_v2(Bucket=PERMANENT_BUCKET)
        if 'Contents' not in s3_objects:
            print("No images found in Permanent-S3 bucket.")
            return None
        
        # Loop through each image in the Permanent-S3 bucket
        for obj in s3_objects['Contents']:
            permanent_key = obj['Key']  # Get image key (file name) from S3
            tenant_id = extract_uuid_from_filename(permanent_key)
            
            response = rekognition_client.compare_faces(
                SourceImage={'S3Object': {'Bucket': source_bucket, 'Name': source_key}},
                TargetImage={'S3Object': {'Bucket': PERMANENT_BUCKET, 'Name': permanent_key}},
                SimilarityThreshold=80
            )
            if response['FaceMatches']:
                print(f"Match found with tenant ID: {tenant_id}")
                return tenant_id
        
    except ClientError as e:
        print(f"Error comparing faces: {str(e)}")
    
    print("No matching tenant found.")
    return None

# Extract the UUID from the file name (assumes format 'UUID.jpeg')
def extract_uuid_from_filename(filename):
    return filename.split('.')[0]  # Returns UUID part of the filename (before .jpeg)

# Use Rekognition's Brightness attribute to determine light status
def detect_light_activity_using_brightness(bucket, key, tenant_id):
    try:
        # Get light threshold and previous light status from environment variables
        light_threshold = int(os.getenv('LIGHT_THRESHOLD', 10))
        previous_light_status = os.getenv('LIGHT_STATUS', 'OFF')
        
        # Call Rekognition detect_faces to get brightness
        response = rekognition_client.detect_faces(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            Attributes=['ALL']
        )
        
        if response['FaceDetails']:
            brightness = response['FaceDetails'][0]['Quality']['Brightness']
            print(f"Brightness: {brightness}")
            
            # Determine current light status based on brightness threshold
            if brightness > light_threshold:
                current_light_status = "ON"
            else:
                current_light_status = "OFF"
            
            # Log the light ON or OFF event based on change in status
            if previous_light_status == "OFF" and current_light_status == "ON":
                log_activity('START', tenant_id)
                os.environ['LIGHT_STATUS'] = "ON"  # Update the environment variable to ON
            elif previous_light_status == "ON" and current_light_status == "OFF":
                log_activity('END', tenant_id)
                os.environ['LIGHT_STATUS'] = "OFF"  # Update the environment variable to OFF
        
        else:
            print("No face detected for brightness analysis.")
    
    except ClientError as e:
        print(f"Error detecting light activity: {str(e)}")

# Detect cooking activity based on image labels
def detect_cooking_activity(bucket, key, tenant_id):
    try:
        response = rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=10,
            MinConfidence=75
        )
        
        # Check for 'Cooking' label
        for label in response['Labels']:
            if label['Name'].lower() == 'cooking pan':
                log_activity('COOKING', tenant_id)
                break
        else:
            print("No cooking activity detected.")
    
    except ClientError as e:
        print(f"Error detecting cooking activity: {str(e)}")

# Log activity to CloudWatch Logs
def log_activity(activity_type, tenant_id):
    timestamp = datetime.utcnow().isoformat() + 'Z'
    log_message = f"Tenant_ID::{tenant_id}|Operation::{activity_type}|TS::{timestamp}"

    try:
        # Check for existing log streams or create a new one
        response = cloudwatch_logs_client.describe_log_streams(
            logGroupName=LOG_GROUP,
            orderBy='LastEventTime',
            descending=True,
            limit=1
        )

        if not response['logStreams']:
            log_stream_name = f"TenantActivityLogs-{tenant_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            cloudwatch_logs_client.create_log_stream(logGroupName=LOG_GROUP, logStreamName=log_stream_name)
        else:
            log_stream_name = response['logStreams'][0]['logStreamName']

        cloudwatch_logs_client.put_log_events(
            logGroupName=LOG_GROUP,
            logStreamName=log_stream_name,
            logEvents=[
                {
                    'timestamp': int(datetime.now().timestamp() * 1000),
                    'message': log_message
                }
            ]
        )
        print(f"Logged activity: {log_message}")

    except ClientError as e:
        print(f"Error logging to CloudWatch: {str(e)}")
