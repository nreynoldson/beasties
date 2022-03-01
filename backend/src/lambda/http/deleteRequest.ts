import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { deleteRequest } from '../../businessLogic/beastiesRequestLogic'
import {createLogger} from '../../utils/logger'

const logger = createLogger('Delete request')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log(event)
  logger.info(`Processing delete request for - ${JSON.stringify(event.pathParameters.userName)}`)
  
  const userName = event.pathParameters.userName
  const shelterName = event.pathParameters.shelterName
  const animalName = event.pathParameters.animalName

  const deleted = await deleteRequest(event)
  
  if(!deleted) {
    logger.error(`delete item failed..Cannot find user: ${userName}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot find user: ${userName}`
      })
    }
  }

  logger.info(`Deleted request status for ${animalName} at ${shelterName} by user ${userName} succeeded`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Deleted item for regular user : ${userName}`
    })
  }
}