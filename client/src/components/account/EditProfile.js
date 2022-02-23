import axios from 'axios';
import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function EditProfile(props){
    const [name, setName]  = useState('');
    const [location, setLocation] = useState('');
    const [isShelter, setShelter] = useState(false);
    const [shelterName, setShelterName] = useState('');
    const [bio, setBio] = useState('');
    const navigate = useNavigate();
    const [formErrors, setErrors] = useState({});
    const createUserURL = 'https://idvmpyv72b.execute-api.us-east-1.amazonaws.com/dev/user';

    const validateForm = () => {     
        var errors = {};
        if(name === "")
            errors['name'] = "Name cannot be blank.";
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
            name: name,
            zipcode: location,
            isShelterOwner: isShelter,
            email: props.user.email,
        }

        if(isShelter)
            userData.shelterName = shelterName;

        console.log(userData);

        axios.post(createUserURL, userData)
        .then(function (response) {
            console.log(response);
            props.updateStatus("complete")
            navigate(-1);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return(
        <div>
                <Form>
                    <div className="button-wrapper">
                        <span className="button-label">Change Password: </span>
                        <Button variant="light" className="change-pass" type="button" onClick={() => props.setView('changePass')}>Change Password</Button>
                    </div>
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
                    <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="bio" 
                            rows={3}
                            value={bio} 
                            onChange= {(e) => {setBio(e.target.value)}}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formErrors.bio}
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
                        <div className="button-wrapper">
                            <span className="button-label"></span>
                            <Button variant="primary" className="pink-btn" type="button" onClick={onSubmit}>
                                Submit
                            </Button>
                        </div>
                </Form>
            </div>
    );
}