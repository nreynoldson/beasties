import React, {useCallback, useState} from 'react';
import {Button, Form, Modal, Alert} from 'react-bootstrap';
import api from '../../api/api';

function RequestButton(props){
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [show, setShow] = useState(false);
    const type = props.requestType;
    const typeDisplay = type == 'date' ? "Date" : "Adopt";
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const handleRequest = () => {
        
        var requestParams = {
            requestType: type,
            requestStatus: "pending",
            startDate: (new Date()).toISOString().split('T')[0],
            endDate:new Date(Date.now() + 604800000),
            userName: props.auth.currentUser.userName,
            animalName: props.animalName,
            shelterName: props.shelterName,
            requestMessage: message
        }
        api.Animal.makeRequest(requestParams).then(processResponse)
    }

    const processResponse = useCallback((response) => {
        if (response.error) {
          // Handle error
          return;
        }
        else {
            setSuccess(true);
            handleClose();
        }
    }, []);


    var alertBanner = success ? <Alert variant={'success'}>
        Request sent successfully!
    </Alert> : '';
          
    return (
        <>
        <Button variant="primary pinkbutton" onClick={handleShow}>
            Request to {typeDisplay}
        </Button>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Request to {typeDisplay} {props.animalName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {alertBanner}
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Message (optional): </Form.Label>
                    <Form.Control 
                        as="textarea" rows={3}
                        name="responseMessage" 
                        value={message} 
                        onChange= {(e) => {setMessage(e.target.value)}}/>
                </Form.Group>
            </Form>

            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" className="requestButtons" onClick={handleRequest}>
                Send
            </Button>
            <Button variant="secondary" className="requestButtons" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
    
        
}

export {RequestButton}