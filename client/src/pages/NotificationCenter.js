import React, { useState, useEffect, useCallback } from 'react';
import {Container} from 'react-bootstrap';
import Notification from '../components/account/Notification';
import './css/Notification.css'
import api from '../api/api';

export default function NotificationCenter(props) {
    const [requests, setRequests] = useState([]);
    const [isShelter, setShelter] = useState(false);
    console.log(props)
    const processRequests = useCallback((response) => {
        console.log(response)
        if (response.error) {
          // Handle error
          return;
        }
        else {
            setRequests(response.result.body.items)
        }
    }, []);

    useEffect(() => {
        const user = props.auth.currentUser;
        setShelter(user.isShelterOwner);
       if(!user.isShelterOwner)
            api.User.getRequests(user.userName).then(processRequests);
        else
            api.Shelter.getRequests(user.shelterName).then(processRequests);
    }, []);

    var requestEl = [];
    requests.forEach((req) => {
            requestEl.push(
                <Notification key={`${req.animalName_shelterName}`} isShelter = {isShelter} req = {req}/>
        )
    });

    return (
        <Container className="notifications">
            <h3>Your Requests</h3>
            {requestEl.length ? requestEl : "No requests to display."}
        </Container>
    );
}

