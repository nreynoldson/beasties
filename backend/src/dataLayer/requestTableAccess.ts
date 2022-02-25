import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {RequestItem} from '../modals/RequestItem'

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

    async getRequestsForUser(userName: string){
        const result = await this.docClient.query({
            TableName: this.requestTable,
            KeyConditionExpression: "userName = :userName",
            ExpressionAttributeValues: {
                ":userName": userName
            }
        }).promise()

        const items = result.Items
        return items as RequestItem[]
    }

    async getRequestsWithStatusForUser(userName: string, requestStatus: string){
        const result = await this.docClient.scan({
            TableName: this.requestTable,
            FilterExpression: "userName = :userName and requestStatus = :requestStatus ",
            ExpressionAttributeValues: {
                ":userName": userName,
                ":requestStatus": requestStatus
            }
        }).promise()

        const items = result.Items
        return items as RequestItem[]
    }
    
    async getPendingReqForShelter(shelterName: string){
        const result = await this.docClient.query({
            TableName: this.requestTable,
            IndexName: 'requestsGSI',
            KeyConditionExpression: "shelterName = :shelterName",
            ExpressionAttributeValues: {
                ":shelterName": shelterName
            }
        }).promise()

        const items = result.Items
        return items as RequestItem[]
    }
    
    async getRequestsForPet(animal_shelter: string, requestStatus: string){
        
        const params = {
            TableName: this.requestTable,
            FilterExpression: 'animalName_shelterName = :animalName_shelterName and requestStatus = :requestStatus',
            ExpressionAttributeValues: {
              ":animalName_shelterName": animal_shelter,
              ":requestStatus": requestStatus
            }
        };

        const results = await this.docClient.scan(params).promise();
        
        const items = results.Items
        return items as RequestItem[]
    }
}