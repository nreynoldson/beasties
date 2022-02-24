import React, { useState } from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import {changePassword} from './Account.js'

export default function ChangePassword(props) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setErrors] = useState('');
    const [success, setSuccess] = useState(false);
    var user = null;
    
    const validateForm = () => {
        var errors = {};
        if(oldPassword === '')
            errors.oldPassword = "Please provide your most recent password."
        if(newPassword === '')
            errors.newPassword = "Please enter a new password."
        if(confirmPassword === '')
            errors.newPassword = "You must confirm your new password."
            
        if(newPassword !== confirmPassword && !errors.hasOwnProperty('newPassword') ){
            errors.newPassword = errors.confirmPassword = "Passwords do not match"
        }
        
        setErrors(errors);
        return Object.keys(formErrors).length > 0;
    }

    const hasError = (key) => {
        return formErrors.hasOwnProperty(key);
    }

    const onSubmit = async (e) => {
        if(validateForm())
            return;
        
        try{
            await changePassword(oldPassword, newPassword);
            setSuccess(true);
        }
        catch {
            console.log('error!');
        }
    }

    var alertBanner = success ? <Alert variant={'success'}>
                            Your password was successfully changed!
                        </Alert> : '';


    return (
        <Form className="change-password">
            <h3>Change Password</h3>
            {alertBanner}
            <Form.Group className="mb-3">
                <Form.Label>Old Password</Form.Label>
                <Form.Control 
                    type="password" 
                    name="oldPassword" 
                    isInvalid= {hasError("oldPassword")} 
                    onChange = {(e) => {setOldPassword(e.target.value)}} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.oldPassword}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Control.Feedback type='invalid'>
                    {formErrors.oldPassword}
                </Form.Control.Feedback>
            <Form.Group className="mb-3">
                <Form.Label> New Password</Form.Label>
                <Form.Control 
                    type="newPassword" 
                    name="newPassword" 
                    isInvalid= {hasError("newPassword")} 
                    onChange = {(e) => {setNewPassword(e.target.value)}} />
                <Form.Control.Feedback type='invalid'>
                    {formErrors.newPassword}
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
    );
}