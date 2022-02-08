import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "../components/Account";
import {Link, useNavigate} from 'react-router-dom';

export default function Login(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {        
        var errors = {};
        if(email === '')
            errors.email = "Username or email cannot be blank."
        if(password === '')
            errors.password = "Password cannot be blank."

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
            await authenticate(email, password)
            props.auth.updateAuthStatus(true);
            navigate(-1);
        }
        catch(err){
           var errors = {};
           errors.aws = err.message;
           setErrors(errors);
        }
    }

    return (
        <div className="login-container">
            <Form className='login'>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        name="email" 
                        onChange = {(e) => setEmail(e.target.value)} 
                        isInvalid = {hasError('email')} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.email}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="password" 
                        onChange = {(e) => setPassword(e.target.value)}
                        isInvalid ={hasError('password')} />
                    <Form.Control.Feedback type='invalid'>
                        {formErrors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <span>{formErrors.aws ? formErrors.aws : ""}</span>
                <Link className="password link" to="/reset-password">Forgot your password?</Link>
                <Button variant="primary" className="pink-btn" type="button" onClick = {onSubmit}>
                    Login
                </Button>
            </Form>
        </div>
    );
}