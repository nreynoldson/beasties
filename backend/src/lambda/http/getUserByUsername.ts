import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserByUsername } from '../../businessLogic/beastiesUserLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get All Posts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get a user by user name - ${JSON.stringify(event)}`)

  const userDetails = await getUserByUsername(event)

  logger.info(`Get user by user name succeeded. ${JSON.stringify(userDetails)}`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: userDetails
    })
  }
  
}