import apigClientFactory from 'aws-api-gateway-client';
import { CreateRequestAPI } from '../requests/CreateRequestAPI';
import { createLogger } from '../utils/logger'

const logger = createLogger('Beasties BusinessLogic Execution')

export async function makeCreateRequestAPICall(requestItem: CreateRequestAPI) {
    console.log('inside api call function')
    var apigClient = apigClientFactory.newClient({
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
        invokeUrl: 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/'
    });
    var method = 'POST';
    var pathTemplate = 'request'
    var params = {};
    var body = {
        requestItem
    };
    console.log(body);
    var additionalParams = {
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    }
    console.log("Im here")
    console.log("Calling yo!")
    return await apigClient.invokeApi(
            params,
            pathTemplate,
            method,
            additionalParams,
            body
    ).then((result) => {
        logger.info(`Successfully invoked create request info endpoint`);
        return Promise.resolve(result)
    }).catch((error) => {
        console.log("Error yo!!!")
        console.log(error)
        return Promise.reject(error)
    })

}