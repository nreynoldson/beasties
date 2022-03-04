import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllAnimals } from '../../businessLogic/beastiesAnimalLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get All Animals')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get all animals - ${JSON.stringify(event)}`)

  const animalDetails = await getAllAnimals()

  logger.info(`Get all animal details ${JSON.stringify(animalDetails)}`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: animalDetails
    })
  }
  
}