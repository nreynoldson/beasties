import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { makeGetUserAPICall } from '../../businessLogic/apiCallForGetUserInfo';
import { makeGetPendingReqForPet } from '../../businessLogic/apiCallForGetPendingReqForPet';
import { deleteAnimal } from '../../businessLogic/beastiesAnimalLogic';

import {createLogger} from '../../utils/logger'

import { RequestTableAccess } from '../../dataLayer/requestTableAccess';

const logger = createLogger('Delete Animal')
const requestTableAccess = new RequestTableAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log(event)
  logger.info(`Processing delete animal for - ${JSON.stringify(event.pathParameters.userName)}`)

  const shelterOwnerName = event.pathParameters.shelterOwnerName
  const animalName = event.pathParameters.animalName
  const shelterName = event.pathParameters.shelterName
  const animal_shelter = animalName + "_" + shelterName

  //shelter owner must own that animal's shelter
  const getUserInfo = await makeGetUserAPICall(shelterOwnerName);
  const shelterNameFromOwner = getUserInfo['data']['items']['shelterName']
  if(!shelterNameFromOwner || (shelterNameFromOwner != shelterName)) {
    logger.error(`Shelter owners can only delete pets in their shelters`)
    return {
        statusCode: 400,
        body: JSON.stringify({
        error: 'Shelter owners can only delete pets in their shelters'
        })
    }
  }
  //delete animal
  const deleted = await deleteAnimal(event)
  
  //update the requests to say that the animal is removed from the profile
  console.log("updating requests related to the deleted animal")
  
  const pendingRequestsForPet = await makeGetPendingReqForPet(animalName, shelterName, "pending");
  const items = pendingRequestsForPet['data']['items']

  items.forEach(element => {
    element['requestStatus'] = "cancelled";
    element['responseMessage'] = "Sorry, the pet you have requested is removed from the profile"
  });
  console.log(`edited items: ${JSON.stringify(items)}`);
  const promises = items.map(async (item) =>  {
    return await requestTableAccess.createRequest(item);
  });

  await Promise.all(promises);
  console.log("updated requests related to the deleted animal: ", animal_shelter);
  
  if(!deleted) {
    logger.error(`delete item failed..Cannot find animal: ${animal_shelter}`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: `Cannot find animal: ${animal_shelter}`
      })
    }
  }

  logger.info(`Deleted animal for ${animal_shelter} succeeded`)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: `Deleted animal : ${animal_shelter}`
    })
  }
}