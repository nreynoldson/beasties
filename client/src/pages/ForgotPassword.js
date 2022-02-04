import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {CognitoUser} from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import {authenticate} from "../components/Account";

export default class ForgotPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            status: "sending",
            formErrors: ""
        }
        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSend = this.onSend.bind(this);
        this.user = null;
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);

    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    async validateEmail(){
        var errors = {};
        if(this.state.status === 'sending'){
            if(this.state.email === ""){
                errors.email = "Email cannot be blank"
            } else {
                const expression = /\S+@\S+/;
                var validEmail = expression.test(String(this.state.email).toLowerCase());
                if(!validEmail){
                    errors.email = "Invalid email"
                }
            }
        }

        this.setState({formErrors: errors});
    }

    async validatePassword(){
        var errors = {};
        console.log('in validate form')
        
        if(this.state.status === 'confirming'){
            if(this.state.password === "")
                errors.password = "New password can't be blank"
            if(this.state.confirmPassword === "")
                errors.confirmPassword = "Please confirm new password"
            if(this.state.confirmationCode === "")
                errors.confirmationCode = "Please provide the confirmation code to reset your password";
        }
        
        if(this.state.password !== this.state.confirmPassword && !errors.hasOwnProperty('password') ){
            errors.password = errors.confirmPassword = "Passwords do not match"
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
        await this.validatePassword();
        if(this.hasError())
            return;
        
            this.user.confirmPassword(this.state.confirmationCode, this.state.password, {
                onSuccess: async () => {
                    console.log('Password confirmed!');
                    await authenticate(this.state.email, this.state.password)
                    this.props.authProps.hasAuthenticated(true);
                },
                onFailure(err) {
                    console.log(err);
                    console.log('Password not confirmed!');
                },
            });
    }

    async onSend (e) {
        console.log('in on submit')
        await this.validateEmail();
        if(this.hasError())
            return;
        this.setState({loading: true})


        var userData = {
            Username: this.state.email,
            Pool: Pool
        };
        this.user = new CognitoUser(userData);
        console.log(this.user);
        this.user.forgotPassword({
            onSuccess: (data) => {
                // successfully initiated reset password request
                console.log('CodeDeliveryData from forgotPassword: ' + data);
                this.setState({status: 'confirming'});
            },
            onFailure: function(err) {
                console.log(err);
            },
            //Optional automatic callback
           /* inputVerificationCode: function(data) {
                console.log('Code sent to: ' + data);
                var code = document.getElementById('code').value;
                var newPassword = document.getElementById('new_password').value;
                cognitoUser.confirmPassword(verificationCode, newPassword, {
                    onSuccess() {
                        console.log('Password confirmed!');
                    },
                    onFailure(err) {
                        console.log('Password not confirmed!');
                    },
                });
            },*/
        });

    }
    render() {
        console.log(this.props)
        if(this.state.status === 'sending'){
            return (
        
                <Form className="login">
                    <p>Enter the email associated with your account and we'll email you a reset link.</p>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" onChange = {this.inputChange}
                        isInvalid= {this.hasError("email")} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="button" onClick = {this.onSend}>
                        Send
                    </Button>
                </Form>
            );
        } else {
            return (
                <Form className="login">
                    <Form.Group className="mb-3">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control type="confirmationCode" name="confirmationCode" 
                        isInvalid= {this.hasError("confirmationCode")} onChange = {this.inputChange} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.confirmationCode}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label> New Password</Form.Label>
                        <Form.Control type="password" name="password" isInvalid= {this.hasError("password")} onChange = {this.inputChange} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" isInvalid= {this.hasError("confirmPassword")} onChange = {this.inputChange} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" className="pink-btn" type="button" onClick = {this.onSubmit}>
                        Submit
                    </Button>
                </Form>
            )
        }

    }
}
