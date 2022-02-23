import apigClientFactory from 'aws-api-gateway-client';
import { createLogger } from '../utils/logger'

const logger = createLogger('Beasties BusinessLogic Execution')

export async function makeGetUserAPICall(userName: string) {
    var apigClient = apigClientFactory.newClient({
        accessKey: process.env.ACCESS_KEY,
        secretKey: process.env.SECRET_KEY,
        invokeUrl: 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/'
    });
    var method = 'GET';
    var pathTemplate = '/user/{userName}'
    var params = {
        userName: userName,
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
            logger.info(`Successfully invoked get user info endpoint`);
            return resolve(result)
        }).catch((error) => {
            reject(error)
        })


    }).catch((error) => {
        console.log(error)
    })

}