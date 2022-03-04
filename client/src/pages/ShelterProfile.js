import React from 'react';

import AnimalConsts from '../consts/Animal';
import {Container, Card, ListGroup, Row, Col, Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import './css/ShelterProfile.css';
import ShelterPets from '../components/shelters/ShelterPets';

const {
  goodWithChildren,
  goodWithOtherAnimals,
  mustBeLeashed
} = AnimalConsts.dispositions;

export default function ShelterProfile(props) {
    const { shelterName } = useParams();

    return(
        <Container className="shelter-container">
            <Row className="shelter-info" xs={1}>
                <Col><Image src="https://885786.smushcdn.com/2409451/wp-content/uploads/2018/08/SEA-Shelter-Nataworry-2018-0064-810x541.jpg?lossy=1&strip=0&webp=1" fluid></Image> </Col>
                <Col>                
                    <Card className="profile-info">
                    <Card.Header>Name</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><span className='label'>Location:</span> <span>98199</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Pets Available:</span> <span>5</span></ListGroup.Item>
                    </ListGroup>
                    <Card.Body>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel risus quis massa feugiat convallis. Nam sit amet eros pulvinar, auctor ipsum et, vestibulum velit. Maecenas quam lacus, consequat id nunc venenatis, rhoncus lacinia erat. Aliquam elementum mauris quis sollicitudin accumsan. Nunc elit tortor, convallis ut ornare ac, egestas id mauris. Integer vel mollis quam. In ac ex nec lectus pretium blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet porttitor augue. Ut risus ante, pretium sed mauris a, ornare convallis velit. Vivamus nec turpis consectetur, pharetra neque at, molestie ante. Nullam volutpat finibus sem, ac lacinia diam dignissim ut. Aenean at ultrices tortor. Curabitur eu gravida diam.</Card.Body>
                    </Card>
                </Col>
            </Row>
            <ShelterPets shelterName={shelterName} auth={props.auth}/>
        </Container>
    );
}
