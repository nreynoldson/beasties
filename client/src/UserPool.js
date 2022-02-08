import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_tl5pl5Opa",
    ClientId: "7visoj8n2o0u54a05gribc2197",
    authenticationFlowType: 'USER_PASSWORD_AUTH'
}

export default new CognitoUserPool(poolData);