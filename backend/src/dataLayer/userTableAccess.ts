import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UserItem } from '../modals/UserItem';

export class UserTableAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
            maxRetries: 10,
            logger: console
        }),
        private readonly userTable = process.env.USER_TABLE) {
    }

    async createUser(userItem){

        await this.docClient.put({
            TableName: this.userTable,
            Item: userItem
        }).promise()

    }

    async getUserByUsername(userName:string): Promise<UserItem> {

        const result = await this.docClient.get({
            TableName: this.userTable,
            Key: {
                userName
            }
        }).promise()

        return result.Item as UserItem
    }
}