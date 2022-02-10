import { AnimalTableAccess } from '../dataLayer/animalTableAccess'

import { CreateAnimalAPIRequest } from '../requests/CreateAnimalAPIRequest'
import { AnimalItem } from '../modals/AnimalItem'
import { createLogger } from '../utils/logger'

//generate BlogAccess and BlogS3Access object instance
const userAccess = new AnimalTableAccess()
const logger = createLogger('Beasties BusinessLogic Execution')

export async function createUser(createUserRequest: CreateUserAPIRequest) : Promise<CreateUserAPIRequest> {
    
    logger.info(`Executing logic for createUser API request ${createUserRequest}`)
    const animalItem = {
        ...createUserRequest
    }
    logger.info('Adding a user to dynamodb')
    await userAccess.createAnimal(animalItem);

    return animalItem

}