import { APIGatewayProxyEvent } from 'aws-lambda'
import { AnimalTableAccess } from '../dataLayer/animalTableAccess'
import { BeastiesS3Access } from '../dataLayer/beastiesS3Access'
import { AnimalItem } from '../modals/AnimalItem'

import { CreateAnimalAPIRequest } from '../requests/CreateAnimalAPIRequest'
import { UpdateAnimal } from '../requests/UpdateAnimal'
import { createLogger } from '../utils/logger'

const animalAccess = new AnimalTableAccess()
const beastiesS3Access = new BeastiesS3Access()

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
        avatar: `http://${beastiesS3Access.getBucketName()}.s3.amazonaws.com/animal/${animal_shelter}`,
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

export async function getAnimalsByShelter(event: APIGatewayProxyEvent) : Promise<AnimalItem[]> {
    
    const shelterName = event.pathParameters.shelterName
    logger.info(`Executing logic for get animals of ${shelterName}`)
    logger.info('Getting all animal\'s details of the given shelter from dynamodb')
    
    return await animalAccess.getAnimalsByShelter(shelterName);

}

export async function getAllAnimals() : Promise<AnimalItem[]> {
    
    logger.info(`Executing logic for get all animals`)
    logger.info('Getting all animal\'s details from dynamodb')
    
    return await animalAccess.getAllAnimals();

}

export async function updateAnimal(event: APIGatewayProxyEvent, updatedAnimal: UpdateAnimal) {
    
    const shelterName = event.pathParameters.shelterName
    const animalName = event.pathParameters.animalName
    const animal_shelter = getConcatenatedName(animalName, shelterName)

    logger.info('Updating animal in dynamodb')
    console.log(`Inside the animal business logic: ${animal_shelter}`);
    
    const animalItem = await animalAccess.getAnimalByNameAndShelter(animal_shelter)
    animalItem['age'] = updatedAnimal['age'] ? updatedAnimal['age'] : animalItem['age']
    animalItem['bio'] = updatedAnimal['bio'] ? updatedAnimal['bio'] : animalItem['bio']
    animalItem['avatar'] = updatedAnimal['avatar'] ? updatedAnimal['avatar'] : animalItem['avatar']
    animalItem['availability'] = updatedAnimal['availability'] ? updatedAnimal['availability'] : animalItem['availability']
    animalItem['disposition'] = updatedAnimal['disposition'] ? updatedAnimal['disposition'] : animalItem['disposition']
    
    const updatedAnimalItem = await animalAccess.createAnimal(animalItem)
    console.log(`Updated animal ${JSON.stringify(updatedAnimalItem)}`)
    logger.info('Updated animal in dynamodb')
    return true

}

export async function deleteAnimal(event: APIGatewayProxyEvent) {
    
    const animalName = event.pathParameters.animalName
    const shelterName = event.pathParameters.shelterName
    const animal_shelter = getConcatenatedName(animalName, shelterName)
    
    logger.info('Deleting animal in dynamodb')
    const result = await animalAccess.deleteAnimal(animal_shelter)
    console.log(`Deleted animal ${JSON.stringify(result)}`)
    logger.info('Deleted animal in dynamodb')
    return true

}

function getConcatenatedName(animal_name, shelter_name) {
    return animal_name + "_" + shelter_name
}