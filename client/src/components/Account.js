import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";

const authenticate = async (Username, Password) => {
    console.log('in authenticate');
    return await new Promise((resolve, reject) => {
        console.log('in authenticate function from Account.js')
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
                console.log("onSuccess: ", data);
                resolve(data)
            }, 
            onFailure: (err) => {
                console.log("onFailure: ", err);
                reject(err);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: ", data);
                resolve(data);
            }
        })
    });
}


const getUser = async() => {
    console.log('in get user');
    return await new Promise((resolve, reject) => {
       var user = Pool.getCurrentUser();
       console.log(user);
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
           console.log('rejecting');
        resolve(null);
       }
       
    });
}
export {getUser, authenticate};