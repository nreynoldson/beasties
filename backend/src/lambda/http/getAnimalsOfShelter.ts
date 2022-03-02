import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAnimalsByShelter } from '../../businessLogic/beastiesAnimalLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get Animals by shelter')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get an animal by shelter - ${JSON.stringify(event)}`)

  const animalDetails = await getAnimalsByShelter(event)

  logger.info(`Get animal details by shelter succeeded. ${JSON.stringify(animalDetails)}`)
  
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