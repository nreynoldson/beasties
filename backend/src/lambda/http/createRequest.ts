import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createRequest } from '../../businessLogic/beastiesRequestLogic'

import {createLogger} from '../../utils/logger'
import { CreateRequestAPI } from '../../requests/CreateRequestAPI'

import { makeGetUserAPICall } from '../../businessLogic/apiCallForGetUserInfo';

const logger = createLogger('Create Request')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Implement creating a new request
  logger.info(`Processing create request event - ${JSON.stringify(event.body)}`)
  
  const newPost: CreateRequestAPI = JSON.parse(event.body)

  if(!newPost.userName) {
    logger.error('User name cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'User name cannot be empty'
      })
    }
  }

  if(!newPost.animalName) {
    logger.error('Animal name cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Animal name cannot be empty'
      })
    }
  }

  if(!newPost.shelterName) {
    logger.error('Shelter name cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Shelter name cannot be empty'
      })
    }
  }
  
  const getUserInfo = await makeGetUserAPICall(newPost.userName);
  logger.info(`user info for ${newPost.userName}: ${getUserInfo['data']}`);
  if(getUserInfo['data']['items']['isShelterOwner'] == true) {
    logger.error(`Cannot create request for users who are shelter owners`)
    return {
        statusCode: 400,
        body: JSON.stringify({
        error: 'Cannot create request for users who are shelter owners'
        })
    }
  }

  logger.info('Creating item...')
  const newRequest = await createRequest(event, newPost)
  
  logger.info(`Created new request ${JSON.stringify(newRequest)}`)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newRequest
    })
  } 
}