import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUsersByUserType } from '../../businessLogic/beastiesUserLogic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Get Users')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Processing Get users by user type - ${JSON.stringify(event)}`)
  
  const userType = event.pathParameters.userType
  let isShelterOwner: boolean;
  if(userType == "regularUsers") {
    isShelterOwner = false
  } else if (userType == "shelterUsers") {
    isShelterOwner = true
  } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: `Cannot find user type: ${userType}`
        })
      }
  }

  const userDetails = await getUsersByUserType(isShelterOwner)

  logger.info(`Get users by user type succeeded. ${JSON.stringify(userDetails)}`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: userDetails
    })
  }
  
}