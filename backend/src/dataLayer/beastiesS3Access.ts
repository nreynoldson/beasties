import {CreateSignedURLRequest} from '../requests/CreateSignedURLRequest'

import * as AWS from 'aws-sdk'

// # References

// https://github.com/vturbin/Serverless-Project
// https://github.com/mu-majid/serverless-todo-app

export class BeastiesS3Access {
    constructor(
        private readonly beastiesS3BucketName = process.env.IMAGES_S3_BUCKET,
        private readonly s3 = new AWS.S3()
    ) {}

    getBucketName() {
        return this.beastiesS3BucketName
    }
    
    getPreSignedUploadURL(createSignedURLRequest) {
        return this.s3.getSignedUrl(
            'putObject',
            createSignedURLRequest    
        )
    }

    getPreSignedGetURL(createSignedURLRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl(
            'getObject',
            createSignedURLRequest
        )
    }
}