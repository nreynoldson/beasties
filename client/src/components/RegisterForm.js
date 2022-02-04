import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import UserPool from "../UserPool";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";
import {TailSpin} from 'react-loader-spinner'

export default class RegisterForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            formErrors: ""
        }

        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

   async validateForm(){        
        var errors = {};
        for (const property in this.state) {
            if(this.state[property] === "" && property !== 'formErrors'){
                errors[property] = "Field cannot be blank"
            }
        }
        
        if(!errors.hasOwnProperty('email')){
            const expression = /\S+@\S+/;
            var validEmail = expression.test(String(this.state.email).toLowerCase());
            if(!validEmail){
                errors.email = "Invalid email."
            }
        }

        if(this.state.password !== this.state.confirmPassword && !errors.hasOwnProperty('password') ){
            errors.password = errors.confirmPassword = "Passwords do not match."
        }
        
        if(this.state.username.length >= 20){
            errors.username = "Username must be less than 20 characters"
        }

        this.setState({formErrors: errors});
    }

    hasError(key = null) {
        if(key)
            return this.state.formErrors.hasOwnProperty(key);

        return Object.keys(this.state.formErrors).length > 0;
    }

    async onSubmit(e){
        await this.validateForm();
         if(this.hasError())
             return;
 
         var attributeList = [
             new CognitoUserAttribute({Name: 'email', Value: this.state.email})
         ];
 
        UserPool.signUp(this.state.username, this.state.password, attributeList, null, (err, data) =>{
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
                
                 this.setState({formErrors: errors});
            }
            else{
                this.props.saveCredentials(this.state.username, this.state.password, data.user);
            }
        });
    }

    render(){ 
        return(
            <Form className = "register">
                {this.hasError('aws') ? <span>{this.state.formErrors.aws}</span> : ""}
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="username" 
                        value={this.state.username} 
                        onChange= {this.inputChange}
                        isInvalid= {this.hasError("username")} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.username}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email" 
                        value={this.state.email} 
                        onChange= {this.inputChange}
                        isInvalid= {this.hasError("email")} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>
            
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="password" 
                        value={this.state.password} 
                        onChange= {this.inputChange}
                        isInvalid= {this.hasError("password")} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="confirmPassword" 
                        value={this.state.confirmPassword} 
                        onChange= {this.inputChange}
                        isInvalid= {this.hasError("confirmPassword")} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" className="pink-btn" type="button" onClick={this.onSubmit}>
                    Submit
                </Button>
                {this.state.loading ? <TailSpin color="#00BFFF" height={80} width={80} /> : ""}
            </Form>
        );
    }
}