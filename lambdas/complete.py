import json
import boto3
from botocore.exceptions import ClientError

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def mark_todo_as_complete(todo_id):
    try:
        # Update the todo item in DynamoDB
        response = table.update_item(
            Key={'id': todo_id},
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':status': 'completed'},
            ReturnValues='ALL_NEW'
        )
        return response
    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        return None

def lambda_handler(event, context):
    try:
        print(f"Received event: {event}")
        # Extract the id from the path parameters
        todo_id = event['pathParameters']['id']
        
        # Mark the todo item as complete
        response = mark_todo_as_complete(todo_id)
        print(f"DynamoDB response: {response}")

        if response and 'Attributes' in response:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Todo item marked as complete', 'item': response['Attributes']})
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Todo item not found'})
            }
    except Exception as e:
        print(f"Exception: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error'})
        }