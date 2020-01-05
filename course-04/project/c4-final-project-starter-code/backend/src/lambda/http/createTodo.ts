import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { v4 } from 'uuid'
import { DynamoDB } from 'aws-sdk'
import { getUserId } from '../utils'
const docClient = new DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const itemId = v4()
  const userId = getUserId(event)
  const item = {
    todoId: itemId,
    userId,
    createdAt: Date.now.toString,
    ...newTodo,
    done: false
  }

  await docClient.put({
    TableName: todosTable,
    Item: item
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}