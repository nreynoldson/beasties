import { APIGatewayProxyEvent } from 'aws-lambda'
import { AnimalTableAccess } from '../dataLayer/animalTableAccess'
import { AnimalItem } from '../modals/AnimalItem'

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
    const animal_shelter = getConcatenatedName(animal_name, shelter_name)

    const animalItem = {
        animalName_shelterName: animal_shelter,
        ...createAnimalRequest
    }
    logger.info('Adding a pet animal to dynamodb')
    await animalAccess.createAnimal(animalItem);

    return animalItem

}

export async function getAnimalByNameAndShelter(event: APIGatewayProxyEvent) : Promise<AnimalItem> {
    
    const animalName = event.pathParameters.animalName
    const shelterName = event.pathParameters.shelterName
    const animalName_shelterName = getConcatenatedName(animalName, shelterName)
    logger.info(`Executing logic for get animal with ${animalName_shelterName}`)
    logger.info('Getting an animal\'s details from dynamodb')
    
    return await animalAccess.getAnimalByNameAndShelter(animalName_shelterName);

}

function getConcatenatedName(animal_name, shelter_name) {
    return animal_name + "_" + shelter_name
}