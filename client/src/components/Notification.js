import React, { useState } from 'react';
import { Col, Row, Button, Card} from 'react-bootstrap';

export default function Notification(props) {

    const acceptRequest = () =>{

    }
    const rejectRequest = () => {

    }

    const handleAdoptionRequest = () => {

    }

    if(props.isShelter){
        var status;
        if(props.req.status === 'pending')
            status = (<><Button className ="adopt-btn"onClick = {acceptRequest}>Accept</Button>
                        <Button className = "adopt-btn" onClick ={rejectRequest}>Reject</Button></>);
        else
            status = "Status: " + props.req.status;

        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={props.req.avatar} />
            <Card.Body>
    
                <Card.Title>{props.req.type === 'date' ? 'Date Request from  ' : 'Adoption Request from '}{props.req.user}</Card.Title>
                <Card.Text>
                <span>{props.req.name}</span><span>•</span><span>{props.req.shelter}</span>
                </Card.Text>
                <Card.Text className={"status " + props.req.status}>{status}</Card.Text>
            </Card.Body>
            </Card>
        );
    }
    else{
        if(props.req.type === 'date' && props.req.status === 'fulfilled')
            status = (<Button className="adopt-btn" onClick = {handleAdoptionRequest}>Request to Adopt</Button>);
        else
            status = props.req.status;

        return(
            <Card  className="card-horizontal">
            <Card.Img variant="left" src={props.req.avatar} />
            <Card.Body>

                <Card.Title>{props.req.type === 'date' ? 'Date Request' : 'Adoption Request'}</Card.Title>
                <Card.Text>
                <span>{props.req.name}</span><span>•</span><span>{props.req.shelter}</span>
                </Card.Text>
                <Card.Text className={"status " + props.req.status}>{status}</Card.Text>
            </Card.Body>
            </Card>
        );
    }   
}



