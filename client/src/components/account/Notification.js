import React, {useEffect, useState} from 'react';
import { Button, Card} from 'react-bootstrap';
import api from '../../api/api';

export default function Notification(props) {
    const [isDeleted, setDeleted] = useState(false);
    const [avatar, setAvatar] = useState('/images/no-image.png');
    const cancelRequest = () => {

        api.User.deleteRequest(req.userName, req.shelterName, req.animalName)
            .then((response)=>{
                setDeleted(true);
            })
    };

    useEffect(() => {
        api.Animal.getInfo(props.req.animalName, props.req.shelterName).then((response) => {
            if(response.error)
                return;
            var pet = response.result;
            if(pet.avatar){
                setAvatar(pet.avatar);
            }
        }
        );
      }, []);
    
    var status, req = props.req;

    if(props.isShelter && !isDeleted){
        if(req.requestStatus === 'pending')
            status = (<Button className ="response-btn" onClick ={() => props.changeView(req)}>Respond</Button>);
        else
            status =(<span><b>Status: </b> {req.requestStatus}</span>);


        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={avatar} />
            <Card.Body>
    
                <Card.Title className="request-type">{req.requestType === 'date' ? 'Date Request from  ' : 'Adoption Request from '}{req.userName}</Card.Title>
                <Card.Text className="animal-details">
                <span>{req.animalName}</span><span>•</span><span>{req.shelterName}</span>
                </Card.Text>
                <Card.Text className="requestMessage">
                {req.requestMessage !== '' ? (<span><b>They said: </b><i>"{req.requestMessage}"</i></span>) :''}
                </Card.Text>
                <Card.Text className="responseMessage">
                {req.responseMessage !== '' ? (<span><b>You said: </b><i>"{req.responseMessage}"</i></span>) :''}
                </Card.Text>
                <Card.Text className={"status " + req.requestStatus}>{status}</Card.Text>
            </Card.Body>
            </Card>
        );
    }
    else if(!isDeleted){
        status = req.requestStatus;

        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={avatar} />
            <Card.Body>

                <Card.Title className="request-type">{req.requestType === 'date' ? 'Date Request' : 'Adoption Request'}</Card.Title>
                <Card.Text className="animal-details">
                <span>{req.animalName}</span><span>•</span><span>{req.shelterName}</span>
                </Card.Text>
                <Card.Text className="requestMessage">
                {req.requestMessage !== '' ? (<span><b>You said: </b><i>"{req.requestMessage}"</i></span>) :''}
                </Card.Text>
                <Card.Text className="responseMessage">
                {req.responseMessage !== '' ? (<span><b>They said: </b><i>"{req.responseMessage}"</i></span>) :''}
                </Card.Text>
                <div className="options-container">
                <Card.Text className={"status " + req.requestStatus}><b>STATUS: </b>{status}</Card.Text>
                {req.requestStatus == 'pending' || req.requestStatus == 'accepted' ? <Button onClick={cancelRequest}>Cancel Request</Button> : ''}
                </div>
            </Card.Body>
            </Card>
        );
    }  else {
        return "";
    } 
}



