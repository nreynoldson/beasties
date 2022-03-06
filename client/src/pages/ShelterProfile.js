import React, {useEffect, useState} from 'react';
import {Container, Card, ListGroup, Row, Col, Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import './css/ShelterProfile.css';
import ShelterPets from '../components/shelters/ShelterPets';
import NotFound from './NotFound';
import api from '../api/api';

export default function ShelterProfile(props) {
    const { shelterName } = useParams();
    const [shelter, setShelter] = useState({});
    const [notFound, setNotFound] = useState(false);
    const [count, setCount] = useState(0);

    const {
      auth
    } = props;
    

    useEffect(() => {
      // Request the necessary data from the back end
      // Grab images from S3
      api.Shelter.getInfo(shelterName).then((response) => {
        console.log(response);
        if(response.error){
          setNotFound(true);
        }
        else{
          setShelter(response)
        }
      })
  }, []);

  if(notFound){
    return <NotFound />
  }
  else{
    return(
        <Container className="shelter-container">
            <Row className="shelter-info" xs={1}>
                <Col xs={8}><Image className="profile-avatar" src={shelter.avatar ? shelter.avatar : '/images/no-image.png'}></Image> </Col>
                <Col>                
                    <Card className="profile-info">
                    <Card.Header>      </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><span className='label'>Shelter Name:</span> <span>{shelter.shelterName}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Location:</span> <span>{shelter.zipcode}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Number of Available Pets:</span> <span>{count}</span></ListGroup.Item>
                    </ListGroup>
                    <Card.Body>{shelter.bio ? shelter.bio : `${shelterName} does not currently have a bio set.`}</Card.Body>
                    </Card>
                </Col>
            </Row>
            <ShelterPets setCount={setCount} shelterName={shelterName} auth={props.auth}/>
        </Container>
    );
  }
}
