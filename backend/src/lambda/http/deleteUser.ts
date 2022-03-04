import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { makeGetUserAPICall } from '../../businessLogic/apiCallForGetUserInfo';
import { deleteUser } from '../../businessLogic/beastiesUserLogic'
import {createLogger} from '../../utils/logger'
import { RequestTableAccess } from '../../dataLayer/requestTableAccess';

const logger = createLogger('Delete user')
const requestTableAccess = new RequestTableAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log(event)
  logger.info(`Processing delete user for - ${JSON.stringify(event.pathParameters.userName)}`)
  
  const userName = event.pathParameters.userName
  
  const getUserInfo = await makeGetUserAPICall(userName);
  console.log(getUserInfo);
  console.log(getUserInfo['data']['items']['isShelterOwner']);
  console.log('yeyyyyy');
  
  if(getUserInfo['data']['items']['isShelterOwner'] == true) {
    logger.error(`Shelter users cannot be deleted.`)
    return {
        statusCode: 400,
        body: JSON.stringify({
        error: 'Shelter users cannot be deleted'
        })
    }
  }

  const deleted = await deleteUser(event)
  
  console.log("deleting requests related to the user")
  const deletedRequestsForUser = await requestTableAccess.deleteAllRequestsForUser(userName);
  console.log("deleted requests related to the user:", deletedRequestsForUser);

  if(!deleted) {
    logger.error(`delete item failed..Cannot find user: ${userName}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot find user: ${userName}`
      })
    }
  }

  logger.info(`Deleted user for ${userName} succeeded`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Deleted user : ${userName}`
    })
  }
}