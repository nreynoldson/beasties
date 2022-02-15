import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import FinishRegistration from '../components/FinishRegistration';
import RegisterConfirm from '../components/RegisterConfirm';
import LogoutButton from '../components/LogoutButton';
import './css/Login.css';


export default function Register(props) {
    const [status, setStatus] = useState('signup');
    const [user, setUser] = useState(null);

    const updateStatus = (newStatus) => {
        if(newStatus === 'finish'){
            props.auth.updateAuthStatus(true);
        }
        setStatus(newStatus)
    }

    const saveCredentials = (username, password, email, user) => {
        var cognitoUser = {username: username, password: password, email: email, cognitoUser: user}
        setUser(cognitoUser);
        setStatus('confirm');
    }

    if(props.auth.isAuthenticated && status !== 'finish'){
        return(<LogoutButton updateAuthStatus ={props.auth.updateAuthStatus}></LogoutButton>);
    } else if(status === 'signup') {
        return (<RegisterForm saveCredentials = {saveCredentials}></RegisterForm>);
    } else if(status === 'confirm') {
        return(<RegisterConfirm user={user} updateStatus={updateStatus}></RegisterConfirm>);
    } else {
        return(<FinishRegistration user={user} updateStatus={updateStatus}></FinishRegistration>);
    }
}