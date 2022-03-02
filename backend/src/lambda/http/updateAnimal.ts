import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateAnimal } from '../../requests/UpdateAnimal'
import { updateAnimal } from '../../businessLogic/beastiesAnimalLogic'

import {createLogger} from '../../utils/logger';

const logger = createLogger('Update animal info')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing Update animal event by - ${JSON.stringify(event.pathParameters.userName)}`)
  
  const animalName = event.pathParameters.animalName
  const shelterName = event.pathParameters.shelterName
  
  const updatedAnimal:  UpdateAnimal = JSON.parse(event.body)
  
  logger.info(`Update animal body ${JSON.stringify(updatedAnimal)}`)
  logger.info('Updating item...')

  const updatedItem = await updateAnimal(event, updatedAnimal)
  
  if(!updatedItem) {
    logger.error(`Update item failed..Cannot find animal: ${animalName} ${shelterName}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot find animal: ${animalName} ${shelterName}`
      })
    }
  }

  logger.info(`Updated request status for animal ${animalName} ${shelterName} succeeded`)
  
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        message: `Updated item for animal : ${animalName} ${shelterName}`,
        item: updatedItem
    })
  }

}