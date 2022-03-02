import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { AnimalItem } from '../modals/AnimalItem';

export class AnimalTableAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
            maxRetries: 10,
            logger: console
        }),
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

    async updateAvailability(updatedStatus:string, animalName: string, shelterName: string) {
        
        const animalName_shelterName = animalName + "_" + shelterName;
        const updatedItem = await this.docClient.update({
            TableName: this.animalTable,
            Key: {
                "animalName_shelterName": animalName_shelterName
            },
            UpdateExpression: 'set availability=:availability',
            ExpressionAttributeValues: {
                ':availability': updatedStatus,
            },
            ReturnValues: "UPDATED_NEW"
            
        }).promise()
        return updatedItem
    }

    async deleteAnimal(animal_shelter: string) {

        const param = {
            TableName: this.animalTable,
            Key: {
                "animalName_shelterName": animal_shelter,
            }
        }

        console.log(param)
        await this.docClient.delete(param).promise()

    }
}