import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import {CognitoUser} from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import {authenticate} from "../components/account/Account";

export default function ForgotPassword(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [status, setStatus] = useState('sending');
    const [formErrors, setErrors] = useState('');
    var user = null;

    const validateEmail = () => {
        var errors = {};
        if(status === 'sending'){
            if(email === ""){
                errors.email = "Email cannot be blank"
            } else {
                const expression = /\S+@\S+/;
                var validEmail = expression.test(String(email).toLowerCase());
                if(!validEmail){
                    errors.email = "Invalid email"
                }
            }
        }
        setErrors(errors);
        return Object.keys(formErrors).length > 0;
    }

    const validatePassword = () => {
        var errors = {};
        
        if(status === 'confirming'){
            if(password === "")
                errors.password = "New password can't be blank"
            if(confirmPassword === "")
                errors.confirmPassword = "Please confirm new password"
            if(confirmationCode === "")
                errors.confirmationCode = "Please provide the confirmation code to reset your password";
        }
        
        if(password !== confirmPassword && !errors.hasOwnProperty('password') ){
            errors.password = errors.confirmPassword = "Passwords do not match"
        }

        setErrors(errors);
        return Object.keys(formErrors).length > 0;
    }

    const hasError = (key) => {
        return formErrors.hasOwnProperty(key);
    }

    const onSubmit = (e) => {
        if(validatePassword())
            return;
        var userData = {
            Username: email,
            Pool: Pool
        };
        user = new CognitoUser(userData);
        
        user.confirmPassword(confirmationCode, password, {
            onSuccess: async () => {
                await authenticate(email, password)
                props.auth.updateAuthStatus(true);
            },
            onFailure(err) {
                console.log(err);
                console.log('Password not confirmed!');
            },
        });
    }

    const onSend = (e) => {
        if(validateEmail())
            return;

        var userData = {
            Username: email,
            Pool: Pool
        };
        user = new CognitoUser(userData);

        user.forgotPassword({
            onSuccess: (data) => {
                // successfully initiated reset password request
                console.log('CodeDeliveryData from forgotPassword: ' + data);
                setStatus('confirming');
            },
            onFailure: function(err) {
                console.log(err);
            }
        });
    }

    if(status === 'sending'){
        return (
            <Form className="login">
                <p>Enter the email associated with your account and we'll email you a reset link.</p>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email" 
                        onChange = {(e) => {setEmail(e.target.value)}}
                        isInvalid= {hasError("email")} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="button" onClick = {onSend}>
                    Send
                </Button>
            </Form>
        );
    } else {
        return (
            <Form className="login">
                <Form.Group className="mb-3">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control 
                        type="confirmationCode" 
                        name="confirmationCode" 
                        isInvalid= {hasError("confirmationCode")} 
                        onChange = {(e) => {setConfirmationCode(e.target.value)}} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.confirmationCode}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label> New Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password" 
                        isInvalid= {hasError("password")} 
                        onChange = {(e) => {setPassword(e.target.value)}} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="confirmPassword" 
                        isInvalid= {hasError("confirmPassword")} 
                        onChange = {(e) => {setConfirmPassword(e.target.value)}} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" className="pink-btn" type="button" onClick = {onSubmit}>
                    Submit
                </Button>
            </Form>
        )
    }
}
