import { APIGatewayProxyEvent } from 'aws-lambda'

import { RequestTableAccess } from '../dataLayer/requestTableAccess'

import { CreateRequestAPI } from '../requests/CreateRequestAPI'
import { RequestItem } from '../modals/RequestItem'
import { UpdateRequest } from '../requests/UpdateRequest'

import { createLogger } from '../utils/logger'

const requestTableAccess = new RequestTableAccess()
const logger = createLogger('Beasties Request BusinessLogic Execution')

export async function createRequest(event: APIGatewayProxyEvent, createRequest: CreateRequestAPI) : Promise<CreateRequestAPI> {
    
    logger.info(`Executing logic for create request API request ${createRequest}`)
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

export async function getAllRequestsForUser(event: APIGatewayProxyEvent) : Promise<CreateRequestAPI[]> {
    
    const userName = event.pathParameters.userName
    logger.info(`Executing logic for getting requests for ${userName}`)
    logger.info('Getting request items from dynamodb')
    
    return await requestTableAccess.getRequestsForUser(userName);

}

export async function getRequestsWithStatus(event: APIGatewayProxyEvent) : Promise<CreateRequestAPI[]> {
    
    const userName = event.pathParameters.userName
    const requestStatus = event.pathParameters.requestStatus
    logger.info(`Executing logic for getting ${requestStatus} requests for ${userName}`)
    logger.info('Getting request items from dynamodb')
    
    return await requestTableAccess.getRequestsWithStatusForUser(userName, requestStatus);

}

export async function getPendingReqForShelter(event: APIGatewayProxyEvent) : Promise<CreateRequestAPI[]> {

    const shelterName = event.pathParameters.shelterName
    logger.info(`Executing logic for getting requests for ${shelterName}`)
    logger.info('Getting request items from dynamodb')
    
    return await requestTableAccess.getPendingReqForShelter(shelterName);

}

export async function getRequestsForPet(event: APIGatewayProxyEvent) : Promise<CreateRequestAPI[]> {
    
    const animalName = event.pathParameters.animalName
    const shelterName = event.pathParameters.shelterName
    const requestStatus = event.pathParameters.requestStatus
    const animal_shelter = getConcatenatedName(animalName, shelterName)
    logger.info(`Executing logic for getting requests for ${animal_shelter}`)
    logger.info('Getting request items from dynamodb')
    
    return await requestTableAccess.getRequestsForPet(animal_shelter, requestStatus);

}

export async function updateRequestByShelter(event: APIGatewayProxyEvent, updatedRequest: UpdateRequest) {
    
    const userName = event.pathParameters.customerName
    const shelterName = event.pathParameters.shelterName
    const animalName = event.pathParameters.animalName
    const animal_shelter = getConcatenatedName(animalName, shelterName)

    logger.info('Updating request in dynamodb')
    console.log(`Inside the request business logic: ${userName}`);
    const result = await requestTableAccess.updatePost(updatedRequest, userName, animal_shelter)
    console.log(`Updated request ${JSON.stringify(result)}`)
    logger.info('Updated request in dynamodb')
    return true

}

export async function deleteRequest(event: APIGatewayProxyEvent) {
    
    const userName = event.pathParameters.userName
    const shelterName = event.pathParameters.shelterName
    const animalName = event.pathParameters.animalName
    const animal_shelter = getConcatenatedName(animalName, shelterName)
    
    logger.info('Deleting request in dynamodb')
    const result = await requestTableAccess.deleteRequest(userName, animal_shelter)
    console.log(`Deleted request ${JSON.stringify(result)}`)
    logger.info('Deleted request in dynamodb')
    return true

}

export async function getRequestDetails(event: APIGatewayProxyEvent) : Promise<RequestItem> {
    
    const animalName = event.pathParameters.animalName
    const shelterName = event.pathParameters.shelterName
    const userName = event.pathParameters.userName
    const animal_shelter = getConcatenatedName(animalName, shelterName)

    logger.info(`Executing logic for get request details for ${userName} and ${animal_shelter}`)
    logger.info('Getting request items from dynamodb')
    
    return await requestTableAccess.getRequestDetails(userName, animal_shelter);

}


function getConcatenatedName(animal_name, shelter_name) {
    return animal_name + "_" + shelter_name
}