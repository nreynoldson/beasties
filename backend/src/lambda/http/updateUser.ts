import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateUser } from '../../requests/UpdateUser'
import { updateUser } from '../../businessLogic/beastiesUserLogic'

import {createLogger} from '../../utils/logger';

const logger = createLogger('Update user info')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing Update user event by - ${JSON.stringify(event.pathParameters.userName)}`)
  
  const userName = event.pathParameters.userName
  
  const updatedUser:  UpdateUser = JSON.parse(event.body)
  
  logger.info(`Update request body ${JSON.stringify(updatedUser)}`)
  logger.info('Updating item...')

  const updatedItem = await updateUser(event, updatedUser)
  
  if(!updatedItem) {
    logger.error(`Update item failed..Cannot find user: ${userName}`)
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

  logger.info(`Updated request status for user ${userName} succeeded`)
  
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        message: `Updated item for user : ${userName}`,
        item: updatedItem
    })
  }

}