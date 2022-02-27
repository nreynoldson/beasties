import React from 'react';
import { Button, Card} from 'react-bootstrap';

export default function Notification(props) {

    const acceptRequest = () =>{

    }
    const rejectRequest = () => {

    }

    const handleAdoptionRequest = () => {

    }
    if(props.isShelter){
        var status, req = props.req;
        if(req.requestStatus === 'pending')
            status = (<><Button className ="adopt-btn"onClick = {acceptRequest}>Accept</Button>
                        <Button className = "adopt-btn" onClick ={rejectRequest}>Reject</Button></>);
        else
            status = "Status: " + req.requestStatus;

        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={req.avatar} />
            <Card.Body>
    
                <Card.Title>{req.requestType === 'date' ? 'Date Request from  ' : 'Adoption Request from '}{req.userName}</Card.Title>
                <Card.Text>
                <span>{req.animalName}</span><span>•</span><span>{req.shelterName}</span>
                </Card.Text>
                <Card.Text className={"status " + req.requestStatus}>{status}</Card.Text>
            </Card.Body>
            </Card>
        );
    }
    else{
        if(req.requestType === 'date' && props.reqquestStatus === 'fulfilled')
            status = (<Button className="adopt-btn" onClick = {handleAdoptionRequest}>Request to Adopt</Button>);
        else
            status = req.requestStatus;

        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={props.req.avatar} />
            <Card.Body>

                <Card.Title>{req.requestType === 'date' ? 'Date Request' : 'Adoption Request'}</Card.Title>
                <Card.Text>
                <span>{req.animalName}</span><span>•</span><span>{req.shelterName}</span>
                </Card.Text>
                <Card.Text className={"status " + req.requestStatus}>{status}</Card.Text>
            </Card.Body>
            </Card>
        );
    }   
}



