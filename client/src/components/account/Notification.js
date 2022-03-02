import React, {useState} from 'react';
import { Button, Card} from 'react-bootstrap';
import api from '../../api/api';

export default function Notification(props) {
    const [isDeleted, setDeleted] = useState(false);
    const cancelRequest = () => {

        api.User.deleteRequest(req.userName, req.shelterName, req.animalName)
            .then((response)=>{
                console.log(response);
                setDeleted(true);
            })
    };
    var status, req = props.req;
    if(props.isShelter){
        if(req.requestStatus === 'pending')
            status = (<Button className ="response-btn" onClick ={() => props.changeView(req)}>Respond</Button>);
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
        if(req.requestType === 'date' && req.requestStatus === 'fulfilled')
            status = (<Button className="adopt-btn" >Request to Adopt</Button>);
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
                <div className="options-container">
                <Card.Text className={"status " + req.requestStatus}>{status}</Card.Text>
                {req.requestStatus == 'pending' || req.requestStatus == 'accepted' ? <Button onClick={cancelRequest}>Cancel Request</Button> : ''}
                </div>
            </Card.Body>
            </Card>
        );
    }   
}



