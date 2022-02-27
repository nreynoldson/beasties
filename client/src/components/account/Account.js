import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import api from '../../api/api'
import Pool from "../../UserPool";
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
                console.log(data);
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

const changePassword = async (oldPassword, newPassword) => {
    return await new Promise((resolve, reject) => {
 
        var user = Pool.getCurrentUser();
        user.getSession(function(err, session) {
            if(err){
                resolve(null)
                return;
            } else{
                user.changePassword(oldPassword, newPassword, (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        console.log(result);
                        resolve(result)
                    }
                });
            }
               
               
        });
    });
}

const getUser = async() => {

    return await new Promise((resolve, reject) => {
       var user = Pool.getCurrentUser();
       console.log(user);
       if(user != null){
           user.getSession(async (err, session) => {
               if (err) {
                   resolve(null)
                   return;
               }

               const { error, result } = await api.User.getInfo(user.username);

               if (error) {
                   console.log(error);
                   return;
               }

               resolve(result.body.items);
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
    },[navigate, props.auth.isAuthenticated])

    return props.children;
}
export {getUser, authenticate, changePassword, RequireAuth};