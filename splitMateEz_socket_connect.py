import json
import boto3
import os

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    connectionId = event['requestContext']['connectionId']

    dynamodb.put_item(
        TableName=os.environ['SOCKET_CONNECT_TABLE'],
        Item={'connectionId': {'S': connectionId}}
    )
    
    return {}