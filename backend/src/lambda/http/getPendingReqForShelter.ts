import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getPendingReqForShelter } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get all open Requests for shelter')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get all open requests for shelter- ${JSON.stringify(event)}`)

  const requestDetails = await getPendingReqForShelter(event)

  logger.info(`Get all open requests for shelter user ${JSON.stringify(requestDetails)}`)
  
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