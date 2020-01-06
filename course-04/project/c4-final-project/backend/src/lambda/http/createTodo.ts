import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { v4 } from 'uuid'
import { getUserId } from '../utils'
import { TodoAccess } from '../../dataLayer/todosAccess'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const itemId = v4()
  const userId = getUserId(event)
  const item = {
    todoId: itemId,
    userId,
    createdAt: Date.now.toString,
    ...newTodo,
    done: false
  }
  const todoAccess = new TodoAccess
  await todoAccess.createTodo(item)

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