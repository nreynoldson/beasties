import React, {useCallback} from 'react';
import {Button} from 'react-bootstrap';
import api from '../../api/api';

function RequestDateButton(props){

    const handleRequest = () => {
        
        var requestParams = {
            requestType: "date",
            requestStatus: "pending",
            startDate: (new Date()).toISOString().split('T')[0],
            userName: props.auth.currentUser.userName,
            animalName: props.animalName,
            shelterName: props.shelterName
        }
        console.log(requestParams);
        api.Animal.makeRequest(requestParams).then(processResponse)
    }

    const processResponse = useCallback((response) => {
        console.log(response)
        if (response.error) {
          // Handle error
          return;
        }
        else {
            //TODO: add some prompt upon success/change button appearance
        }
    }, []);

    return(
        <Button className="pink-btn nav-btn" onClick={handleRequest}>Request Date</Button>
    );
}

function RequestAdoptionButton(props){
    console.log(props);

    const handleRequest = () => {
        
        var requestParams = {
            requestType: "adoption",
            requestStatus: "pending",
            startDate: (new Date()).toISOString().split('T')[0],
            userName: props.auth.currentUser.userName,
            animalName: props.animalName,
            shelterName: props.shelterName
        }
        console.log(requestParams);
        api.Animal.makeRequest(requestParams).then(processResponse)
    }

    const processResponse = useCallback((response) => {
        console.log(response)
        if (response.error) {
          // Handle error
          return;
        }
        else {
            //TODO: add some prompt upon success/change button appearance
        }
    }, []);

    return(
        <Button className="pink-btn nav-btn" onClick={handleRequest}>Request to Adopt</Button>
    );
}

export {RequestDateButton, RequestAdoptionButton}