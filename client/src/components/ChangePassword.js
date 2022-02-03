import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';

export default class ChangePassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            formErrors: ""
        }
        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validateForm = this.validateEmail.bind(this);
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
        if(this.state.newPassword !== this.state.confirmPassword && !errors.hasOwnProperty('newPassword') ){
            errors.newPassword = errors.confirmPassword = "Passwords do not match"
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
        
        this.user.changePassword(this.state.oldPassword, this.state.newPassword, (err, result) => {
            if (err) {
                console.log(err)
                var errors = {'aws': err.message};
                this.setState({formErrors: errors});
            } else {
                console.log('success!');
            }
        });

    }

    render() {
        return (
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="oldPassword" 
                        isInvalid= {this.hasError("oldPassword")} 
                        onChange = {this.inputChange} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.oldPassword}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label> New Password</Form.Label>
                    <Form.Control 
                        type="newPassword" 
                        name="newPassword" 
                        isInvalid= {this.hasError("newPassword")} 
                        onChange = {this.inputChange} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.newPassword}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="confirmPassword" 
                        isInvalid= {this.hasError("confirmPassword")} 
                        onChange = {this.inputChange} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.formErrors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="button" onClick = {this.onSubmit}>
                    Submit
                </Button>
            </Form>
        )
    }
}