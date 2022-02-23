import { APIGatewayProxyEvent } from 'aws-lambda'

import { RequestTableAccess } from '../dataLayer/requestTableAccess'

import { CreateRequestAPI } from '../requests/CreateRequestAPI'
import { createLogger } from '../utils/logger'

const requestTableAccess = new RequestTableAccess()
const logger = createLogger('Beasties BusinessLogic Execution')

export async function createRequest(event: APIGatewayProxyEvent, createRequest: CreateRequestAPI) : Promise<CreateRequestAPI> {
    
    logger.info(`Executing logic for createAnimal API request ${createRequest}`)
    const eventBody = JSON.parse(event['body']);
    const user_name = eventBody['userName']
    const animal_name = eventBody['animalName']
    const shelter_name = eventBody['shelterName']
    logger.info(`user name, ${user_name}`)
    logger.info(`animal name, ${animal_name}`)
    logger.info(`shelter name, ${shelter_name}`)

    const animal_shelter = getConcatenatedName(animal_name, shelter_name)

    const requestItem = {
        animalName_shelterName: animal_shelter,
        ...createRequest
    }
    logger.info('Adding a request for user in dynamodb')
    await requestTableAccess.createRequest(requestItem);

    return requestItem

}

function getConcatenatedName(animal_name, shelter_name) {
    return animal_name + "_" + shelter_name
}