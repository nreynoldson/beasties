import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAnimalByNameAndShelter } from '../../businessLogic/beastiesAnimalLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get All Posts')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get an animal by name and shelter - ${JSON.stringify(event)}`)

  const animalDetails = await getAnimalByNameAndShelter(event)

  logger.info(`Get animal details by animal name and shelter name succeeded. ${JSON.stringify(animalDetails)}`)
  
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