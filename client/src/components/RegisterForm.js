import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import UserPool from "../UserPool";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";

export default class RegisterForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            formErrors: "",
            test: 0
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
        console.log('in validate form')
        
        var errors = {};
        for (const property in this.state) {
            if(this.state[property] === ""){
                errors[property] = "Field cannot be blank"
            }
        }
        
        if(!errors.hasOwnProperty('email')){
            const expression = /\S+@\S+/;
            var validEmail = expression.test(String(this.state.email).toLowerCase());
            if(!validEmail){
                errors.email = "Invalid email"
            }
        }

        if(this.state.password !== this.state.confirmPassword && !errors.hasOwnProperty('password') ){
            errors.password = errors.confirmPassword = "Passwords do not match"
        }
        
        if(this.state.username.length >= 20){
            errors.username = "Username must be less than 20 characters"
        }

        this.setState({formErrors: errors});
        console.log(errors);
    }

    hasError(key = null) {
        console.log('in has error')
        if(key)
            return this.state.formErrors.hasOwnProperty(key);
            console.log('no key')
            console.log(this.state.formErrors)
            console.log(Object.keys(this.state.formErrors).length);
        return Object.keys(this.state.formErrors).length > 0;
    }

    async onSubmit(e){
        console.log('in onsubmit')
        await this.validateForm();
        console.log(this.hasError())
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
                 else 
                     errors.aws = err.message;
                 console.log(err);
                 this.setState({formErrors: errors});
             }
             else{
                 console.log(data);
                 this.props.saveCredentials(this.state.username, this.state.password, data.user);
             }
         });
 
     }

    render(){ 
        console.log('in render')
        console.log(this.state)
        console.log(this.state.formErrors)
        return(
            <Form>
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

                <Button variant="primary" type="button" onClick={this.onSubmit}>
                    Submit
                </Button>
            </Form>
        );
    }
}