import json
import boto3
from boto3.dynamodb.conditions import Key

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def stringify_objects(items):
    stringified_items = []
    for item in items:
        stringified_item = {key: str(value) for key, value in item.items()}
        stringified_items.append(stringified_item)
    return stringified_items

def get_all_todos():
    try:
        response = table.scan()
        return response.get('Items', [])
    except Exception as e:
        print(f"Error retrieving todos: {e}")
        return []

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }

    try:        
        # Get all todo items from DynamoDB
        todos = get_all_todos()
        print("Retrieved todos:", todos)

        # Stringify the objects
        stringified_todos = stringify_objects(todos)

        # Return the todos as the API response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(stringified_todos)
        }
    except Exception as e:
        print(f"Error handling request: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal Server Error' })
        }
