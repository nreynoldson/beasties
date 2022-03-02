import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getRequestsWithStatus } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get all open Requests from a user')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get all open requests from a user- ${JSON.stringify(event)}`)

  const requestDetails = await getRequestsWithStatus(event)

  logger.info(`Get all open requests ${JSON.stringify(requestDetails)}`)
  
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