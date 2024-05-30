import json
import boto3
from botocore.exceptions import ClientError

# Create a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def update_todo_item(todo_id, title=None, description=None):
    try:
        # Create the UpdateExpression and ExpressionAttributeValues dynamically
        update_expression = 'SET '
        expression_attribute_values = {}
        expression_attribute_names = {}

        if title:
            update_expression += '#title = :title, '
            expression_attribute_values[':title'] = title
            expression_attribute_names['#title'] = 'title'
        
        if description:
            update_expression += '#description = :description, '
            expression_attribute_values[':description'] = description
            expression_attribute_names['#description'] = 'description'
        
        # Remove the trailing comma and space
        update_expression = update_expression.rstrip(', ')

        response = table.update_item(
            Key={'id': todo_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
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
        
        # Parse the body for title and description
        body = json.loads(event['body'])
        title = body.get('title')
        description = body.get('description')
        
        # Update the todo item
        response = update_todo_item(todo_id, title, description)
        print(f"DynamoDB response: {response}")

        if response and 'Attributes' in response:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Todo item updated', 'item': response['Attributes']})
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
