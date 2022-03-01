import apigClientFactory from 'aws-api-gateway-client';
import { createLogger } from '../utils/logger'

const logger = createLogger('Beasties BusinessLogic Execution')

export async function makeGetRequestInfoAPICall(userName: string, animalName: string, shelterName: string) {
    console.log("Inside api call");
    var apigClient = apigClientFactory.newClient({
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        invokeUrl: 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/'
    });
    var method = 'GET';
    var pathTemplate = 'requestDetails/{userName}/{shelterName}/{animalName}'
    var params = {
        userName: userName,
        shelterName:shelterName,
        animalName:animalName
    };
    var body = {};
    var additionalParams = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        apigClient.invokeApi(
            params,
            pathTemplate,
            method,
            additionalParams,
            body
        ).then((result) => {
            logger.info(`Successfully invoked get request info endpoint`);
            return resolve(result)
        }).catch((error) => {
            reject(error)
        })


    }).catch((error) => {
        console.log(error)
    })

}