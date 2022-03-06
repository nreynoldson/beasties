import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/beastiesS3Logic'

import {createLogger} from '../../utils/logger'

const logger = createLogger('Generate SignedURL')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info( `Processing generateSignedURL event ${JSON.stringify(event)}`)
  
  const signedURL = await generateUploadUrl(event)
  
  logger.info(`Signed url - ${signedURL}`)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: signedURL
    })
  }
}