import React, { useState, useEffect, useCallback } from 'react';
import {Container, Spinner} from 'react-bootstrap';
import Notification from '../components/account/Notification';
import { usePromiseTracker } from 'react-promise-tracker';
import './css/Notification.css'
import api from '../api/api';
import { ResponseView } from '../components/shelters/ResponseView';

export default function NotificationCenter(props) {
    const [requests, setRequests] = useState([]);
    const [isShelter, setShelter] = useState(false);
    const [view, setView] = useState('default');
    const [selectedRequest, setSelectedRequest] = useState({});
    const { promiseInProgress } = usePromiseTracker();

    const processRequests = useCallback((response) => {
        console.log(response)
        if (response.error) {
          // Handle error
          return;
        }
        else {
            setRequests(response.result)
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

    const changeView = (req) =>{
        setSelectedRequest({...req});
        setView('responseView')
    };

    var requestEl = [];
    requests.forEach((req) => {
            requestEl.push(
                <Notification key={`${req.animalName_shelterName}`} isShelter = {isShelter} req ={req} changeView={changeView}/>
        )
    });

    var content;
    if(promiseInProgress){
        content = (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>)
    }
    else {
        content = requestEl.length ? requestEl : "No requests to display.";
    }

    if(view == 'default'){
        return (
            <Container className="notifications">
                <h3>Your Requests</h3>
                {content}
            </Container>
        );
    }
    else{
        return (
            <ResponseView params={selectedRequest} auth={props.auth} setView={setView}></ResponseView>
        )
    }

}

