import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import UserPool from "../UserPool";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";

export default class AdopteeRegister extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            errors: {}
        }
        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    onSubmit(e){
       // verifyInputs();
       this.validateForm();
       console.log(this.hasError())
        if(this.hasError())
            return;

        var attributeList = [
            new CognitoUserAttribute({Name: 'name', Value: this.state.name}), 
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
                this.setState({errors: errors});
            }
            else{
                console.log(data);
            }
        });
    }

    validateForm(){
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

        this.setState({errors: errors});
        console.log(errors);
    }

    hasError(key = null) {
        if(key)
            return this.state.errors.hasOwnProperty(key);
        
            console.log('no key')
        return !Object.keys(this.state.errors).length === 0;
    }

    render() {
        return (
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
                        {this.state.errors.username}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="name" 
                        value={this.state.name} 
                        onChange= {this.inputChange}
                        isInvalid= {this.hasError("name")} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.errors.name}
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
                        {this.state.errors.email}
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
                        {this.state.errors.password}
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
                        {this.state.errors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="button" onClick={this.onSubmit}>
                    Submit
                </Button>
            </Form>
        );
    }
}