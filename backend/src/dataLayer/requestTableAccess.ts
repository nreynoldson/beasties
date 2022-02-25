import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

export class RequestTableAccess{
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly requestTable = process.env.USER_ANIMAL_REQUESTS_TABLE) {
    }

    async createRequest(requestItem){

        await this.docClient.put({
            TableName: this.requestTable,
            Item: requestItem
        }).promise()

    }
}