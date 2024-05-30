import json
import boto3
from botocore.exceptions import ClientError

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def get_todo(todo_id):
    try:
        response = table.get_item(
            Key={'id': todo_id}
        )
        if 'Item' in response:
            return response['Item']
        else:
            return None
    except ClientError :
        return None

def lambda_handler(event, context):
    try:
        # Extract the id from the path parameters
        todo_id = event['pathParameters']['id']
        
        # Get the item from DynamoDB
        todo = get_todo(todo_id)
        if todo:
            return {
                'statusCode': 200,
                'body': json.dumps(todo)
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Todo item not found'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }