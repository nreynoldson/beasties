import { APIGatewayProxyEvent } from 'aws-lambda'
import { UserTableAccess } from '../dataLayer/userTableAccess'

import { CreateUserAPIRequest } from '../requests/CreateUserAPIRequest'
import { UserItem } from '../modals/UserItem'
import { createLogger } from '../utils/logger'
import { UpdateUser } from '../requests/UpdateUser'

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

export async function getUsersByUserType(isShelterOwner: boolean) : Promise<UserItem[]> {
    
    logger.info(`Executing logic for getting users with isShelterOwner attribute: ${isShelterOwner}`)
    logger.info('Getting users from dynamodb')
    
    return await userAccess.getUsersByUserType(isShelterOwner);

}

export async function updateUser(event: APIGatewayProxyEvent, updatedUser: UpdateUser) {
    
    const userName = event.pathParameters.userName

    logger.info('Updating user in dynamodb')
    console.log(`Inside the user business logic: ${userName}`);
    const result = await userAccess.updateUser(updatedUser, userName)
    console.log(`Updated user ${JSON.stringify(result)}`)
    logger.info('Updated user in dynamodb')
    return true

}

export async function deleteUser(event: APIGatewayProxyEvent) {
    
    const userName = event.pathParameters.userName
    
    logger.info('Deleting user in dynamodb')
    const result = await userAccess.deleteUser(userName)
    console.log(`Deleted user ${JSON.stringify(result)}`)
    logger.info('Deleted user in dynamodb')
    return true

}