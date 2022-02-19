import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import { useNavigate } from "react-router-dom";
import {useEffect} from 'react';
import axios from 'axios';

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
    const URL = 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/user/';
    return await new Promise((resolve, reject) => {
       var user = Pool.getCurrentUser();
       console.log(user);
       if(user != null){
           user.getSession(function(err, session) {
               if(err){
                   resolve(null)
                   return;
               }
               axios.get(URL + user.username)
               .then(function (response) {
                   resolve(response.data.items);
               })
               .catch(function (error) {
                   console.log(error);
               });
               
           });
       }
       else{
            resolve(null);
       }
       
    });
}

function RequireAuth(props){
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.auth.isAuthenticated){
         navigate("/login")   
        }
    },[])

    return props.children;
}
export {getUser, authenticate, RequireAuth};