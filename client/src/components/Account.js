import React, {createContext, useState} from 'react';
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";

const AccountContext = createContext();

const Account = (props) => {
    const [authed, setAuthed] = useState(false);
    
    const getSession = async() => {
        console.log('in getSession')
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            console.log(user);
            if(user){
                user.getSession((err, session) => {
                    if(err){
                        setAuthed(false);
                        reject(err);
                    } else {
                        setAuthed(true);
                        resolve(session);
                    }
                });
            } else {
                setAuthed(false);
                reject();
            }
        });
    }

    const isAuthenticated = async() => {
       var session = await getSession();
       console.log(session)
    }

    const authenticate = async (Username, Password) => {
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
                    setAuthed(true);
                    resolve(data)
                }, 
                onFailure: (err) => {
                    setAuthed(false);
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

    const logout = () => {
        const user = Pool.getCurrentUser();
        if(user){
            setAuthed(false);
            user.signOut();
        }
    }
    return(
    <AccountContext.Provider value={{authenticate, getSession, logout, authed}}>
        {props.children}
    </AccountContext.Provider>
    );
};
export {Account, AccountContext};