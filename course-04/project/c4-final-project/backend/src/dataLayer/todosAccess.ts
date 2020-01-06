import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly tableName = process.env.TODOS_TABLE) {
  }

  async getTodos(userId) {
    return await this.docClient.query({
      TableName: this.tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  }

  async createTodo(item) {
    await this.docClient.put({
      TableName: this.tableName,
      Item: item
    }).promise()
  }

  async deleteTodo(userId, todoId) {
    await this.docClient.delete({
      TableName: this.tableName,
      Key: {
        userId,
        todoId
      }
    }).promise()
    }

  async generateUploadUrl(userId, todoId, attachmentUrl) {
    await this.docClient.update({
      TableName: this.tableName,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(userId)',
      UpdateExpression: 'set attachmentUrl = :u',
      ExpressionAttributeValues: {
        ":u": attachmentUrl
      },
    }).promise()
  }

  async updateTodo(userId, todoId, todoName, dueDate, done) {
    await this.docClient.update({
      TableName: this.tableName,
      Key: { userId, todoId },
      ConditionExpression: 'attribute_exists(userId)',
      UpdateExpression: 'set todoName = :n, dueDate = :d, done = :y',
      ExpressionAttributeValues: {
        ':n': todoName,
        ':d': dueDate,
        ':y': done
      },
    }).promise()
    }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}