import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "../components/Account";
import {Link} from 'react-router-dom';

export default class PetProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            formErrors: {}
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
        if(this.state.email === '')
            errors.email = "Username or email cannot be blank."
        if(this.state.password === '')
            errors.password = "Password cannot be blank."

        this.setState({formErrors: errors});
    }

    hasError(key = null) {
        if(key)
            return this.state.formErrors.hasOwnProperty(key);

        return Object.keys(this.state.formErrors).length > 0;
    }

    async onSubmit (e) {
        await this.validateForm();
        if(this.hasError())
            return;

        try{
            await authenticate(this.state.email, this.state.password)
            this.props.authProps.hasAuthenticated(true);
        }
        catch(err){
           var errors = {};
           errors.aws = err.message;
           this.setState({formErrors: errors});
        }
    }
    render() {
        return (
            <div className="login-container">
                <Form className='login'>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            onChange = {this.inputChange} 
                            isInvalid = {this.hasError('email')} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="password" 
                            onChange = {this.inputChange}
                            isInvalid ={this.hasError('password')} />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formErrors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <span>{this.state.formErrors.aws ? this.state.formErrors.aws : ""}</span>
                    <Link className="password link" to="/reset-password">Forgot your password?</Link>
                    <Button variant="primary" className="pink-btn" type="button" onClick = {this.onSubmit}>
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}