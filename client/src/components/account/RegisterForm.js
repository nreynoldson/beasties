import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import UserPool from "../../UserPool";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import {TailSpin} from 'react-loader-spinner'

export default function RegisterForm(props){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setErrors] = useState({});

    const validateForm = () => {     
        var errors = {};
        if(username === "")
            errors['username'] = "Username cannot be blank.";
        if(email === "")
            errors['email'] = "Email cannot be blank.";
        if(password === "")
            errors['password'] = "Please set a password";
        if(confirmPassword === "")
            errors['confirmPass'] = "You must confirm your password.";
        
        if(!errors.hasOwnProperty('email')){
            const expression = /\S+@\S+/;
            var validEmail = expression.test(String(email).toLowerCase());
            if(!validEmail){
                errors.email = "Please input a valid email"
            }
        }

        if(password !== confirmPassword && !errors.hasOwnProperty('password') ){
            errors.password = errors.confirmPassword = "Passwords do not match."
        }
        
        if(username.length >= 20){
            errors.username = "Username must be less than 20 characters"
        }

        setErrors(errors);
        return Object.keys(errors).length > 0;
    }

    const hasError = (key) => {
        return formErrors.hasOwnProperty(key);
    }

    const onSubmit = (e) => {
        if(validateForm()){
            return;
        }
 
         var attributeList = [
             new CognitoUserAttribute({Name: 'email', Value: email})
         ];
 
        UserPool.signUp(username, password, attributeList, null, (err, data) =>{
            if(err){
                var errors = {};
                if(err.name === "InvalidPasswordException")
                    errors.password = err.message;
                else if(err.name === "UsernameExistsException")
                    errors.username = err.message;
                else if(err.name === "UserLambdaValidationException")
                     errors.email = "Email already registered to an existing account.";
                 else 
                     errors.aws = err.message;
                setErrors(errors);
            }
            else{
                props.saveCredentials(username, password, email, data.user);
            }
        });
    }

    return(
        <Form className = "register">
            {hasError('aws') ? <span>{formErrors.aws}</span> : ""}
            <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange= {(e) => {setUsername(e.target.value)}}
                    isInvalid= {hasError("username")} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.username}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange= {(e) => {setEmail(e.target.value)}}
                    isInvalid= {hasError("email")} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.email}
                </Form.Control.Feedback>
            </Form.Group>
        
            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="text" 
                    name="password" 
                    value={password} 
                    onChange= {(e) => {setPassword(e.target.value)}}
                    isInvalid= {hasError("password")} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.password}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="text" 
                    name="confirmPassword" 
                    value={confirmPassword} 
                    onChange= {(e) => {setConfirmPassword(e.target.value)}}
                    isInvalid= {hasError("confirmPassword")} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.confirmPassword}
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" className="pink-btn" type="button" onClick={onSubmit}>
                Submit
            </Button>
        </Form>
    );
}