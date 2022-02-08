import { APIGatewayProxyEvent } from 'aws-lambda'
import { UserTableAccess } from '../dataLayer/userTableAccess'

import { CreateUserAPIRequest } from '../requests/CreateUserAPIRequest'
import { UserItem } from '../modals/UserItem'
import { createLogger } from '../utils/logger'

//generate BlogAccess and BlogS3Access object instance
const userAccess = new UserTableAccess()
const logger = createLogger('Beasties BusinessLogic Execution')

export async function createUser(createUserRequest: CreateUserAPIRequest) : Promise<CreateUserAPIRequest> {
    
    logger.info(`Executing logic for createUser API request ${createUserRequest}`)
    const userItem = {
        ...createUserRequest
    }
    logger.info('Adding a user to dynamodb')
    await userAccess.createUser(userItem);

    return userItem

}

export async function getUserByUsername(event: APIGatewayProxyEvent) : Promise<UserItem> {
    
    const userName = event.pathParameters.userName
    logger.info(`Executing logic for get user with ${userName}`)
    logger.info('Getting a user from dynamodb')
    
    return await userAccess.getUserByUsername(userName);

}