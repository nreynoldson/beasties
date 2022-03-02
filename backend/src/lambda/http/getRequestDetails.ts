import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getRequestDetails } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get request details')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Geting a request's information - ${JSON.stringify(event)}`)

  const requestDetails = await getRequestDetails(event)

  logger.info(`Request details : ${JSON.stringify(requestDetails)}`)
  
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