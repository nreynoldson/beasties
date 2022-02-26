import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getRequestsForPet } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get requests for pet')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get requests for a pet- ${JSON.stringify(event)}`)

  const requestDetails = await getRequestsForPet(event)

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