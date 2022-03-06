import React, { useState } from 'react';
import {Form, Button, Alert, Modal} from 'react-bootstrap';
import api from '../../api/api';
import ImageManagement from '../images/ImageManagement';

export default function EditProfile(props){
    const user = props.auth.currentUser;
    const [name, setName]  = useState(user.name);
    const [success, setSuccess]  = useState(false);
    const [location, setLocation] = useState(user.zipcode);
    const [bio, setBio] = useState(user.bio ? user.bio : '');
    const [formErrors, setErrors] = useState({});
    const [show, setShow] = useState(false);

    const handleDelete = () => {
        setShow(false);
        api.User.delete(user.userName)
    }
    const handleShow = () => setShow(true);

    const validateForm = () => {     
        var errors = {};
        if(name === "")
            errors['name'] = "Name cannot be blank.";
        if(location === "")
            errors['location'] = "Zipcode cannot be blank";
        
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
            displayName: name,
            zipcode: location,
            bio: bio
        }

        api.User.updateUser(user.userName, userData).then((response) => {
            if (response.error) {
                // Handle error
                return;
              }
              else {
                  setSuccess(true);
              }
        });
    }

    const handleUploadAvatar = (imageFile) => {

        api.User.uploadImage(user.userName).then(({ error, result }) => {

            if (!error) {
              api.Image.uploadImage(result.uploadUrl, imageFile).then(() => {
      
                // Put a random number after the avatar url to force the image to reload
                user.avatar = `${user.avatar}?${Math.random()}`;
              });
            }
        });
    }

    var alertBanner = success ? <Alert variant={'success'}>
        Successfully updated profile!
    </Alert> : '';
    return(
        
        <div>
            {alertBanner}
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
                    <Modal show={show} onHide={()=>{setShow(false)}}>
                        <Modal.Header closeButton>
                        <Modal.Title>DELETE ACCOUNT</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete your account? This cannot be undone and all pending requests will be cancelled.</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleDelete}>
                            Confirm
                        </Button>
                        <Button variant="danger" onClick={() =>{setShow(false)}}>
                            Cancel
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <ImageManagement
                        allowEdit={true}
                        avatarImageUrl={user.avatar}
                        onUploadImage={handleUploadAvatar}
                        type="user"
                    />

                    <Button variant="secondary" type="button" onClick={onSubmit}>
                        Submit
                    </Button>
                    {user.isShelterOwner ? 
                        (
                            <Button variant="danger" type="button" onClick={handleShow}>
                                Delete account
                            </Button>
                        ) : ""
                    }
            </Form>
        </div>
    );
}