import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

export class UserTableAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly userTable = process.env.USER_TABLE) {
    }

    async createUser(userItem){

        await this.docClient.put({
            TableName: this.userTable,
            Item: userItem
        }).promise()

    }
}