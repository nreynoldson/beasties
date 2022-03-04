import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {RequestItem} from '../modals/RequestItem'
import { UpdateRequest } from '../requests/UpdateRequest';


export class RequestTableAccess{
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
            maxRetries: 10,
            logger: console
        }),
        private readonly requestTable = process.env.USER_ANIMAL_REQUESTS_TABLE) {
    }

    async createRequest(requestItem){

        return await this.docClient.put({
            TableName: this.requestTable,
            Item: requestItem
        }).promise();

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
        
        const scanResults = [];
        let items
        do{
            items = await this.docClient.scan({
                TableName: this.requestTable,
                FilterExpression: "userName = :userName and requestStatus = :requestStatus ",
                ExpressionAttributeValues: {
                    ":userName": userName,
                    ":requestStatus": requestStatus
                }
            }).promise()
            items.Items.forEach((item) => scanResults.push(item))
        } while(typeof items.LastEvaluatedKey !== "undefined");
        
        return scanResults as RequestItem[]

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

        const scanResults = [];
        let items
        do{
            items = await this.docClient.scan(params).promise()
            items.Items.forEach((item) => scanResults.push(item))
        } while(typeof items.LastEvaluatedKey !== "undefined");
        
        return scanResults as RequestItem[]
    }

    async updatePost(updatedRequest:UpdateRequest, userName:string, animal_shelter: string) {

        const updatedItem = await this.docClient.update({
            TableName: this.requestTable,
            Key: {
                "userName": userName,
                "animalName_shelterName": animal_shelter
            },
            UpdateExpression: 'set requestStatus=:requestStatus, responseMessage=:responseMessage',
            ExpressionAttributeValues: {
                ':requestStatus': updatedRequest['requestStatus'],
                ':responseMessage': updatedRequest['responseMessage']
            },
            ReturnValues: "UPDATED_NEW"
            
        }).promise()
        return updatedItem
    }

    async deleteRequest(userName: string, animal_shelter: string) {

        const param = {
            TableName: this.requestTable,
            Key: {
                "userName": userName,
                "animalName_shelterName": animal_shelter
            }
        }

        console.log(param)
        await this.docClient.delete(param).promise()

    }

    async getRequestDetails(userName:string, animal_shelter:string) {

        const result = await this.docClient.get({
            TableName: this.requestTable,
            Key: {
                "userName": userName,
                "animalName_shelterName": animal_shelter
            }
        }).promise()

        return result.Item as RequestItem
    }

    async deleteAllRequestsForUser(userName: string) {
        const queryParams = {
            TableName: this.requestTable,
            KeyConditionExpression: 'userName = :userName',
            ExpressionAttributeValues: { ':userName': userName } ,
        }
        const queryResults = await this.docClient.query(queryParams).promise()
        if (queryResults.Items && queryResults.Items.length > 0) {
            
            const batchCalls = chunks(queryResults.Items, 25).map( async (chunk) => {
            const deleteRequests = chunk.map( item => {
                return {
                DeleteRequest : {
                    Key : {
                    'userName' : item.userName,
                    'animalName_shelterName' : item.animalName_shelterName,
                    }
                }
                }
            })

            const batchWriteParams = {
                RequestItems : {
                    "Beasties-request-dev" : deleteRequests
                }
            }
            await this.docClient.batchWrite(batchWriteParams).promise()
            })

            await Promise.all(batchCalls)
        }
        // console.log(param)
        // await this.docClient.delete(param).promise()
    }
}

function chunks(inputArray, perChunk) {
    return inputArray.reduce((all,one,i) => {
      const ch = Math.floor(i/perChunk); 
      all[ch] = [].concat((all[ch]||[]),one); 
      return all
   }, [])
  }