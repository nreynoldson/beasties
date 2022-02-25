import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllRequestsForUser } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get All Requests from a user')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get all requests from a user- ${JSON.stringify(event)}`)

  const requestDetails = await getAllRequestsForUser(event)

  logger.info(`Get all requests for user ${JSON.stringify(requestDetails)}`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: requestDetails
    })
  }
  
}