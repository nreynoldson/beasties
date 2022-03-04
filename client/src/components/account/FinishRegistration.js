import axios from 'axios';
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
    const [formErrors, setErrors] = useState({});
    const createUserURL = 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/user';

    const validateForm = () => {     
        var errors = {};
        if(name === "")
            errors['name'] = "Name cannot be blank.";
        if(dob === "")
            errors['dob'] = "Date of birth cannot be blank.";
        if(location === "")
            errors['location'] = "Please set a password";
        if(isShelter && shelterName === "")
            errors['shelterName'] = "Please provide your shelter's name.";
        
        if(!errors.hasOwnProperty('zipcode')){
            const expression = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            var validZip = expression.test(location);
            if(!validZip){
                errors.zip = "Invalid zipcode."
            }
        }

        setErrors(errors);
        return Object.keys(errors).length > 0;
    }

    const onSubmit = () => {
        if(validateForm())
            return;
        
        var userData = {
            userName: props.user.username,
            displayName: name,
            zipcode: location,
            isShelterOwner: isShelter,
            email: props.user.email,
        }

        if(isShelter)
            userData.shelterName = shelterName;

        axios.post(createUserURL, userData)
        .then(function (response) {
            props.updateStatus("complete")
            navigate(-1);
        })
        .catch(function (error) {
        });
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
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="dob" 
                            value={dob} 
                            onChange= {(e) => {setDob(e.target.value)}}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.dob}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Zipcode</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="zipcode" 
                            value={location} 
                            onChange= {(e) => {setLocation(e.target.value)}}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.location}
                        </Form.Control.Feedback>
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
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.shelterName}
                            </Form.Control.Feedback>
                        </Form.Group>
                            </> : ""}
                        <Button variant="primary" className="pink-btn" type="button" onClick={onSubmit}>
                            Submit
                        </Button>
                </Form>
            </div>
    );
}