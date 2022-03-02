import * as AWS from 'aws-sdk'
import { UpdateUser } from '../requests/UpdateUser';
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

    async getUsersByUserType(isShelterOwner: boolean): Promise<UserItem[]> {
        const result = await this.docClient.scan({
            TableName: this.userTable,
            FilterExpression: "isShelterOwner = :isShelterOwner ",
            ExpressionAttributeValues: {
                ":isShelterOwner": isShelterOwner
            }
        }).promise()

        const items = result.Items
        return items as UserItem[]
    }

    async updateUser(updatedUser:UpdateUser, userName:string) {

        const updatedItem = await this.docClient.update({
            TableName: this.userTable,
            Key: {
                "userName": userName,
            },
            UpdateExpression: 'set displayName=:name, bio=:bio, zipcode=:zipcode, avatar=:avatar',
            ExpressionAttributeValues: {
                ':name': updatedUser['displayName'],
                ':bio': updatedUser['bio'],
                ':zipcode': updatedUser['zipcode'],
                ':avatar': updatedUser['avatar']
            },
            ReturnValues: "UPDATED_NEW"
            
        }).promise()
        return updatedItem
    }

    async deleteUser(userName: string) {

        const param = {
            TableName: this.userTable,
            Key: {
                "userName": userName,
            }
        }

        console.log(param)
        await this.docClient.delete(param).promise()

    }
}