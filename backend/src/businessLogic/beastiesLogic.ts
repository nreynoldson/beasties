import { UserTableAccess } from '../dataLayer/userTableAccess'

import { CreateUserAPIRequest } from '../requests/CreateUserAPIRequest'

import { createLogger } from '../utils/logger'

//generate BlogAccess and BlogS3Access object instance
const userAccess = new UserTableAccess()
const logger = createLogger('Blog BusinessLogic Execution')

export async function createUser(createUserRequest: CreateUserAPIRequest) : Promise<CreateUserAPIRequest> {
    
    logger.info(`Executing logic for createUser API request ${createUserRequest}`)
    const userItem = {
        ...createUserRequest
    }
    logger.info('Adding a post to dynamodb')
    await userAccess.createUser(userItem);

    return userItem

}