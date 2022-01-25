import {CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-1_q5YtkZar7",
    ClientId: "7dgto0kqekkc98enm89bj8j0tb",
    authenticationFlowType: 'USER_PASSWORD_AUTH'
}

export default new CognitoUserPool(poolData);