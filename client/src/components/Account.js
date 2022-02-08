import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";

const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username,
            Pool
        });

        const authDetails = new AuthenticationDetails({
            Username,
            Password
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                resolve(data)
            }, 
            onFailure: (err) => {
                reject(err);
            },
            newPasswordRequired: (data) => {
                resolve(data);
            }
        })
    });
}


const getUser = async() => {
    return await new Promise((resolve, reject) => {
       var user = Pool.getCurrentUser();
       if(user != null){
           user.getSession(function(err, session) {
               if(err){
                   resolve(null)
                   return;
               }
               user.getUserAttributes(function(err,attributes) {
                   if(err){
                       resolve(null);
                   }
                   resolve(attributes);
               });
               
           });
       }
       else{
            resolve(null);
       }
       
    });
}
export {getUser, authenticate};