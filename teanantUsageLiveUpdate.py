import json
import csv
import boto3
from datetime import datetime
from io import StringIO

s3 = boto3.client('s3')
bucket_name = 'tenantactivitylogs'
csv_file_key = 'tenant_activity_logs.csv'

def lambda_handler(event, context):
    log_data = event['awslogs']['data']
    decoded_data = json.loads(log_data)
    
    # Download the existing CSV file from S3
    csv_content = get_csv_content(bucket_name, csv_file_key)
    
    # Process each log event
    for log_event in decoded_data['logEvents']:
        log_message = log_event['message']
        parsed_log = parse_log(log_message)
        
        tenant_id = parsed_log['Tenant ID']
        activity = parsed_log['Operation']
        
        if 'START_TS' in parsed_log:
            start_ts = parsed_log['START_TS']
            csv_content.append({
                'TenantID': tenant_id,
                'Activity': activity,
                'START_TS': start_ts,
                'END_TS': '',
                'Cost': ''
            })
            print(f"Added START_TS: {start_ts} for TenantID: {tenant_id}, Activity: {activity}")
        
        elif 'END_TS' in parsed_log:
            end_ts = parsed_log['END_TS']
            # Find the latest entry without an END_TS for this tenant and activity
            for row in reversed(csv_content):
                if row['TenantID'] == tenant_id and row['Activity'] == activity and row['END_TS'] == '':
                    start_ts = row['START_TS']
                    time_spent = calculate_time_spent(start_ts, end_ts)
                    cost = time_spent * 2  # 2 AUD per unit time spent
                    row['END_TS'] = end_ts
                    row['Cost'] = cost
                    print(f"Updated END_TS: {end_ts}, Cost: {cost} AUD for TenantID: {tenant_id}, Activity: {activity}")
                    break
    
    # Write the updated CSV content back to S3
    write_csv_content(bucket_name, csv_file_key, csv_content)

    return {
        'statusCode': 200,
        'body': json.dumps('Log processed successfully!')
    }

def parse_log(log_message):
    """Parses the log message into a dictionary"""
    parsed = {}
    parts = log_message.split('|')
    for part in parts:
        key, value = part.split('::')
        parsed[key.strip()] = value.strip()
    return parsed

def calculate_time_spent(start_ts, end_ts):
    """Calculates time spent between start_ts and end_ts in minutes"""
    start_time = datetime.strptime(start_ts, "%Y-%m-%dT%H:%M:%S.%fZ")
    end_time = datetime.strptime(end_ts, "%Y-%m-%dT%H:%M:%S.%fZ")
    time_spent = (end_time - start_time).total_seconds() / 60  # Convert to minutes
    return time_spent

def get_csv_content(bucket_name, csv_file_key):
    """Reads the CSV content from S3"""
    try:
        response = s3.get_object(Bucket=bucket_name, Key=csv_file_key)
        csv_content = response['Body'].read().decode('utf-8')
        return list(csv.DictReader(StringIO(csv_content)))
    except s3.exceptions.NoSuchKey:
        return []  # Return an empty list if the file does not exist

def write_csv_content(bucket_name, csv_file_key, csv_content):
    """Writes the CSV content back to S3"""
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=['TenantID', 'Activity', 'START_TS', 'END_TS', 'Cost'])
    writer.writeheader()
    writer.writerows(csv_content)
    s3.put_object(Bucket=bucket_name, Key=csv_file_key, Body=output.getvalue())