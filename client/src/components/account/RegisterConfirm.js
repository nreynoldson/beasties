import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "./Account";

export default function RegisterConfirm(props) {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('')

    const handleConfirmation = async (e) => {
        e.preventDefault();

        try{
            var cognitoUser = props.user.cognitoUser;
            var username = props.user.username;
            var password = props.user.password;
            await cognitoUser.confirmRegistration(confirmationCode, true, async (err, result) =>
            {
                if (err) {
                    setError(err.message);
                    return;
                } else {
                    try{
                        await authenticate(username, password);
                        props.updateStatus("finish");
                    }
                    catch(err){
                        if(error === "")
                            setError(err.message);
                    }
                }
            });
        }
        catch(err){
            if(error === "")
                setError(err.message);
        }
    }
    return(
        <Form className="register">
            <Form.Group controlId="confirmationCode">
                <Form.Label>Confirmation Code</Form.Label>
                <Form.Control autoFocus type="tel"  
                    name="confirmationCode" 
                    value={confirmationCode} 
                    onChange={(e) => {setConfirmationCode(e.target.value)}}
                    isInvalid ={error !== ''} />
                <Form.Control.Feedback type='invalid'>
                    {error}
                </Form.Control.Feedback>
            </Form.Group>
        
            <Button variant="primary" className="pink-btn" type="button" onClick={handleConfirmation}>
                Submit
            </Button>
        </Form>
    );
}