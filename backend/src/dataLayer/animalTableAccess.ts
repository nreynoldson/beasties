import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

export class AnimalTableAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly animalTable = process.env.ANIMAL_TABLE) {
    }

    async createAnimal(animalItem){

        await this.docClient.put({
            TableName: this.animalTable,
            Item: animalItem
        }).promise()

    }
}