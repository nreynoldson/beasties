import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateRequest } from '../../requests/UpdateRequest'
import { updateRequestByShelter } from '../../businessLogic/beastiesRequestLogic'
import { makeGetUserAPICall } from '../../businessLogic/apiCallForGetUserInfo';
import { makeGetRequestInfoAPICall } from '../../businessLogic/apiCallForGetRequestDetails';
import { makeGetPendingReqForPet } from '../../businessLogic/apiCallForGetPendingReqForPet';

import {createLogger} from '../../utils/logger';
import { RequestTableAccess } from '../../dataLayer/requestTableAccess';
import { AnimalTableAccess } from '../../dataLayer/animalTableAccess';

const requestTableAccess = new RequestTableAccess();
const animalTableAccess = new AnimalTableAccess();

const logger = createLogger('Update Request Status By shelter owner')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing Update request event by - ${JSON.stringify(event.pathParameters.shelterOwnerName)}`)
  
  const shelterUserName = event.pathParameters.shelterOwnerName
  const userName = event.pathParameters.customerName
  const animalName = event.pathParameters.animalName
  const shelterName = event.pathParameters.shelterName
  
  const updatedRequest:  UpdateRequest = JSON.parse(event.body)
  
  const getUserInfo = await makeGetUserAPICall(shelterUserName);

  if(getUserInfo['data']['items']['isShelterOwner'] == false) {
    logger.error(`Requests cannot be edited by regular user. The editing user must be a shelter owner`)
    return {
        statusCode: 400,
        body: JSON.stringify({
        error: 'Requests cannot be edited by regular user. The editing user must be a shelter owner'
        })
    }
  }

  logger.info(`Update request body ${JSON.stringify(updatedRequest)}`)
  logger.info('Updating item...')

  const updatedItem = await updateRequestByShelter(event, updatedRequest)
  
  if(!updatedItem) {
    logger.error(`Update item failed..Cannot find user: ${userName}`)
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

  logger.info(`Updated request status for user ${userName} succeeded`)
  
  const getRequestDetails = await makeGetRequestInfoAPICall(userName, animalName, shelterName);

  if(getRequestDetails['data']['items']['requestType'] == "adoption" && updatedRequest.requestStatus == "accepted") {
    
    const pendingRequestsForPet = await makeGetPendingReqForPet(animalName, shelterName, "pending");
    const items = pendingRequestsForPet['data']['items']

    items.forEach(element => {
        element['requestStatus'] = "cancelled";
        element['responseMessage'] = "Sorry, the pet you have requested is adopted by someone"
    });
    console.log(`edited items: ${JSON.stringify(items)}`);

    const promises = items.map(async (item) =>  {
        return await requestTableAccess.createRequest(item);
    });

    await Promise.all(promises);

    const updatedAnimalStatus = await animalTableAccess.updateAvailability("adopted", animalName, shelterName);
    console.log(updatedAnimalStatus);

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: `Updated item for regular user : ${userName}`,
          item: updatedItem
        })
      }
  } else {
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: `Updated item for regular user : ${userName}`,
          item: updatedItem
        })
      }
  }

}