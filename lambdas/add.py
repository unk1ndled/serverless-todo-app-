import json
import uuid
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Todo")

def stringify_objects(obj):
    if isinstance(obj, dict):
        return {str(key): str(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [stringify_objects(item) for item in obj]
    else:
        return obj

def post_todo(todo):
    todo_item = {
        "id": str(uuid.uuid4()),  # Generate a unique id
        "title": todo["title"],
        "body": todo["description"],
        "status": "unfinished",
    }
    try:
        response = table.put_item(Item=todo_item, ReturnValues="NONE")  # Changed ReturnValues to "NONE"
        return todo_item["id"]  # Return the newly generated UUID
    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        return {"error": e.response["Error"]["Message"]}

def lambda_handler(event, context):
    try:
        # Extract the task from the event
        body = json.loads(event.get('body', '{}'))  # Parse the JSON body
        task = body.get('Task')
        # Check if task is provided
        if not task:
            return {"statusCode": 400, "body": "Missing required field: Task"}

        response = post_todo(task)
        return {
            "statusCode": 200,
            "body": json.dumps(stringify_objects({"id": response}))
        }  # Return the UUID

    except Exception as e:
        print(f"Exception: {str(e)}")
        return {"statusCode": 500, "body": "Internal Server Error: " + str(e)}
