import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { AnimalItem } from '../modals/AnimalItem';

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

    async getAnimalByNameAndShelter(animalName_shelterName:string): Promise<AnimalItem> {

        const result = await this.docClient.get({
            TableName: this.animalTable,
            Key: {
                animalName_shelterName
            }
        }).promise()

        return result.Item as AnimalItem
    }
}