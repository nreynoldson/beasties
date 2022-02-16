import { APIGatewayProxyEvent } from 'aws-lambda'
import { AnimalTableAccess } from '../dataLayer/animalTableAccess'

import { CreateAnimalAPIRequest } from '../requests/CreateAnimalAPIRequest'
import { createLogger } from '../utils/logger'

const animalAccess = new AnimalTableAccess()
const logger = createLogger('Beasties BusinessLogic Execution')

export async function createAnimal(event: APIGatewayProxyEvent, createAnimalRequest: CreateAnimalAPIRequest) : Promise<CreateAnimalAPIRequest> {
    
    logger.info(`Executing logic for createAnimal API request ${createAnimalRequest}`)
    const eventBody = JSON.parse(event['body']);
    const animal_name = eventBody['animalName']
    const shelter_name = eventBody['shelterName']
    logger.info(`animal name, ${animal_name}`)
    logger.info(`shelter name, ${shelter_name}`)
    const animal_shelter = animal_name + "_" + shelter_name

    const animalItem = {
        animalName_shelterName: animal_shelter,
        ...createAnimalRequest
    }
    logger.info('Adding a pet animal to dynamodb')
    await animalAccess.createAnimal(animalItem);

    return animalItem

}