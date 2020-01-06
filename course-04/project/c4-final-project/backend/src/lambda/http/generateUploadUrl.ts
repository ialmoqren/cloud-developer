import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'
import * as AWSXRay from 'aws-xray-sdk'

const bucketName = process.env.S3_BUCKET
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const docClient = new XAWS.DynamoDB.DocumentClient()
const tableName = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: process.env.SIGNED_URL_EXPIRATION
  })

  const attachmentUrl = "https://" + bucketName + ".s3.amazonaws.com/" + todoId

  await docClient.update({
    TableName: tableName,
    Key: { userId, todoId },
    ConditionExpression: 'attribute_exists(userId)',
    UpdateExpression: 'set attachmentUrl = :u',
    ExpressionAttributeValues: {
      ":u": attachmentUrl
    },
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
