import React, { Component } from 'react';
import { Col, Row, Button, Card} from 'react-bootstrap';

export default class Notification extends Component {
    constructor(props){
        super(props);
        this.state = {
            update: false
        }
    }

    render() {
        if(this.props.isShelter){
            var status;
            if(this.props.req.status === 'pending')
                status = (<><Button className ="adopt-btn"onClick = {this.acceptRequest}>Accept</Button>
                            <Button className = "adopt-btn" onClick ={this.rejectRequest}>Reject</Button></>);
            else
                status = "Status: " + this.props.req.status;

            return(
                <Card  className="card-horizontal">
                <Card.Img variant="left" src={this.props.req.avatar} />
                <Card.Body>
        
                    <Card.Title>{this.props.req.type === 'date' ? 'Date Request from  ' : 'Adoption Request from '}{this.props.req.user}</Card.Title>
                    <Card.Text>
                    <span>{this.props.req.name}</span><span>•</span><span>{this.props.req.shelter}</span>
                    </Card.Text>
                    <Card.Text className={"status " + this.props.req.status}>{status}</Card.Text>
                </Card.Body>
                </Card>
            );
        }
        else{
            if(this.props.req.type === 'date' && this.props.req.status === 'fulfilled')
                status = (<Button className="adopt-btn" onClick = {this.handleAdoptionRequest}>Request to Adopt</Button>);
            else
                status = this.props.req.status;

            return(
                <Row>
                    <h2 className="request-title">{this.props.req.type === 'date' ? 'Date Request' : 'Adoption Request'}</h2>
                    <Col xs={2}>
                        <div className="pet-image"></div>
                    </Col>
                    <Col>
                        <span>{this.props.req.name}</span><span>•</span><span>{this.props.req.shelter}</span>
                    </Col>
                    <Col>
                        <div>{status}</div>
                    </Col>
                </Row>
            );
        }   
    }
}



