import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateUserAPIRequest } from '../../requests/CreateUserAPIRequest'
import { createUser } from '../../businessLogic/beastiesUserLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Create Post')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Implement creating a new user
  logger.info(`Processing CreateUser event - ${JSON.stringify(event.body)}`)
  
  const newPost: CreateUserAPIRequest  = JSON.parse(event.body)

  if(!newPost.userName) {
    logger.error('User name cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'User name cannot be empty'
      })
    }
  }
  
  logger.info('Creating item...')
  const newUser = await createUser(newPost)
  
  logger.info(`Created new user ${JSON.stringify(newUser)}`)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newUser
    })
  } 
}