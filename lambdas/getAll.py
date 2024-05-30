import json
import boto3
from boto3.dynamodb.conditions import Key

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def get_all_todos():
    try:
        response = table.scan()
        return response.get('Items', [])
    except Exception as e:
        return []

def lambda_handler(event, context):
    try:        
        # Get all todo items from DynamoDB
        todos = get_all_todos()
        print("Retrieved todos:", todos)

        # Return the todos as the API response
        return {
            'statusCode': 200,
            'body': json.dumps(todos)
        }
    except Exception :
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error' })
        }