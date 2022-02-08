import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm(props){
    const [name, setName]  = useState('');
    const [dob, setDob] = useState('');
    const [location, setLocation] = useState('');
    const [isShelter, setShelter] = useState(false);
    const [shelterName, setShelterName] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        //store data to db
        props.updateStatus("complete")
        navigate(-1);
    }

    return(
        <div className="register">
            <h2>Almost there! Finish setting up your account:</h2>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name" 
                            value={name} 
                            onChange= {(e) => {setName(e.target.value)}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="dob" 
                            value={dob} 
                            onChange= {(e) => {setDob(e.target.value)}}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Location</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="location" 
                            value={location} 
                            onChange= {(e) => {setLocation(e.target.value)}}
                            />
                    </Form.Group>

                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="I am a shelter owner/worker"
                        onChange = {(e) => {setShelter(e.target.checked)}}
                    />

                    {isShelter ? 
                        <><Form.Group className="mb-3">
                            <Form.Label>Shelter Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="shelterName" 
                                value={shelterName} 
                                onChange= {(e) => {setShelterName(e.target.value)}}
                            />
                        </Form.Group>
                            </> : ""}
                        <Button variant="primary" className="pink-btn" type="button" onClick={onSubmit}>
                            Submit
                        </Button>
                </Form>
            </div>
    );
}