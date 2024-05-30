import json
import boto3
from botocore.exceptions import ClientError

# Create a DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Todo")


def delete_todo(todo_id):
    try:
        response = table.delete_item(Key={"id": todo_id}, ReturnValues="ALL_OLD")
        return response
    except ClientError as e:
        print(f"ClientError: {e.response['Error']['Message']}")
        return None


def lambda_handler(event, context):
    try:
        # Extract the id from the path parameters
        todo_id = event["pathParameters"]["id"]

        # Delete the item from DynamoDB
        response = delete_todo(todo_id)

        if response and "Attributes" in response:
            return {
                "statusCode": 200,
                "body": json.dumps(
                    {"message": "Todo item deleted", "item": response["Attributes"]}
                ),
            }
        return {"statusCode": 404, "body": json.dumps({"error": "Todo item not found"})}
      
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
