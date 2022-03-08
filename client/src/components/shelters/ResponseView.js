import React, {useState, useCallback} from 'react';
import {Button, Form, Alert} from 'react-bootstrap';
import {ArrowLeftShort} from 'react-bootstrap-icons';
import api from '../../api/api';

function ResponseView(props){
    const [response, setResponse] = useState('');
    const [success, setSuccess] = useState(false);
    
    const handleRequest = (e) => {
        var shelterOwner = props.auth.currentUser.userName;
        var requestParams = {
            requestStatus: e.target.id,
            responseMessage: response
        }
        api.Shelter.updateRequest(shelterOwner, props.params.userName, props.params.shelterName, props.params.animalName, requestParams).then(processResponse);
    }

    const processResponse = useCallback((response) => {
        if (response.error) {
          // Handle error
          return;
        }
        else {
            setSuccess(true);
        }
    }, []);


    var alertBanner = success ? <Alert variant={'success'}>
        Response sent successfully!
    </Alert> : '';
    return(
        <div>
            <div className="back-wrapper">
                <ArrowLeftShort size={30} onClick={() => {props.setView('default')}}/>
            </div>
            {alertBanner}
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Message (optional): </Form.Label>
                    <Form.Control 
                        as="textarea" rows={3}
                        name="responseMessage" 
                        value={response} 
                        onChange= {(e) => {setResponse(e.target.value)}}/>
                </Form.Group>
            </Form>

            <Button className="response-btn" variant="primary" id="accepted" onClick={handleRequest}>Accept</Button>
            <Button className="response-btn" id="declined" variant="secondary" onClick={handleRequest}>Decline</Button>
        </div>
    );
}


export {ResponseView};