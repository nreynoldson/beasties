import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateAnimalAPIRequest } from '../../requests/CreateAnimalAPIRequest'
import { createAnimal } from '../../businessLogic/beastiesAnimalLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Create Post')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  // TODO: Implement creating a new pet animal
  logger.info(`Processing create animal event - ${JSON.stringify(event.body)}`)
  
  const newPost: CreateAnimalAPIRequest = JSON.parse(event.body)

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
    logger.error('Shelter name for an animal cannot be empty')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Shelter name cannot be empty'
      })
    }
  }
  
  logger.info('Creating item...')
  const newAnimal = await createAnimal(event, newPost)
  
  logger.info(`Created new pet animal ${JSON.stringify(newAnimal)}`)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newAnimal
    })
  } 
}