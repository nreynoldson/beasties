import {APIGatewayProxyEvent} from 'aws-lambda'

import { BeastiesS3Access } from '../dataLayer/beastiesS3Access'
import { createLogger } from '../utils/logger'

const beastiesS3Access = new BeastiesS3Access()
const logger = createLogger('Beasties S3 BusinessLogic Execution')

export async function generateUploadUrl(event: APIGatewayProxyEvent) {

    const beastiesS3BucketName = beastiesS3Access.getBucketName()
    const imageKey = event.pathParameters.imageKey
    let paramsKey: string;
    // console.log(event);
    
    if(event.path.includes("user")){
        // console.log("Im in user")
        paramsKey = `user/${imageKey}`
    }
    if(event.path.includes("animal")){
        // console.log("Im in animal")
        paramsKey = `animal/${imageKey}`
    }
    console.log(paramsKey);
    const urlExpiration = 3000
    
    logger.info(`Getting Upload URL for post ${imageKey}`)

    const createSignedURLRequest = {
        Bucket: beastiesS3BucketName,
        Key: paramsKey,
        ContentType: 'image/png',
        Expires: urlExpiration
    }
    return await beastiesS3Access.getPreSignedUploadURL(createSignedURLRequest)

}
