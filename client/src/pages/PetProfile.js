import React, { useEffect, useState} from 'react';
import {Container, Card, ListGroup, Col, Button} from 'react-bootstrap';
import LoginButton from '../components/LoginButton';
import AnimalConsts from '../consts/Animal';
import { useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import './css/PetProfile.css';

var data = {
    id: 1,
    name: 'Fido',
    age: 'young',
    gender: 'male',
    type: 'dog',
    breed: 'englishSpringerSpaniel',
    availability: 'available',
    imageUrl: null,
    dateCreated: '2022-01-23T18:44:20.051Z',
    shelter: 'Happy Paws',
    bio: "Fido was rescued from the streets of Fresno where he was running around with a gang of small dogs. He is a sweet boy that loves to give kisses and cuddle. Given his background, he can be slightly skittish when it comes to body handling and does exhibit some resource guarding. He would do well in a house without children, but would fare well with other dogs."
};

export default function PetProfile(props) {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [petInfo, setPetInfo] = useState({});

    useEffect(() => {
        // Request the necessary data from the back end
        // Grab images from S3
        var petData = {...data};
        var type = AnimalConsts.typeToDisplayNameMap[data.type];

        if (data.type === 'dog' || data.type === 'cat') {
        const breedToDisplayNameMap = (data.type === 'dog') ?
            AnimalConsts.dogBreedsToDisplayNameMap :
            AnimalConsts.catBreedsToDisplayNameMap;
            var breed = breedToDisplayNameMap[data.breed];
        }

        petData.type = type;
        petData.breed = breed;

        setPetInfo(petData);
    }, []);

    const requestDate = () => {
        // Create request to backend
    }

    const requestToAdopt = () => {
        // Create request to backend
    }

    const goToEditPage = () => {

        navigate(`/pet/${petId}/edit`);
    };

    var settings = {
        dots: true,
        infinite: true,
        centerMode: true,
        centerPadding: 0,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true
      };


    var profileActions;
    if(props.auth.updateAuthStatus){

        let editButton = null;
        // TODO: check if user is owner for pet's shelter
        if (true) {
            editButton = (
                <Button onClick={goToEditPage} variant="secondary">
                    Edit
                </Button>
            );
        }
        profileActions = (
            <div className="profile-actions"> 
                <Button onClick={requestDate}>Request a Date</Button>
                <Button onClick={requestToAdopt}>Request to Adopt</Button>
                {editButton}
            </div>
        );
    } else{
        profileActions = (
            <div className="profile-actions">
                <span>Login to make a request!</span>
                <LoginButton></LoginButton>
            </div>);
    }
    return(
        <Container className="profile-container">
            <Col>
                <Card className="profile-info">
                <Card.Header>{petInfo.name}</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><span className='label'>Type:</span> <span>{petInfo.type}</span></ListGroup.Item>
                    <ListGroup.Item><span className='label'>Breed:</span> <span>{petInfo.breed}</span></ListGroup.Item>
                    <ListGroup.Item><span className='label'>Age:</span> <span>{petInfo.age}</span></ListGroup.Item>
                    <ListGroup.Item><span className='label'>Gender:</span><span>{petInfo.gender}</span></ListGroup.Item>
                    <ListGroup.Item><span className='label'>Availability:</span><span>{petInfo.availability}</span></ListGroup.Item>
                    <ListGroup.Item><span className='label'>Shelter:</span><span>{petInfo.shelter}</span></ListGroup.Item>
                </ListGroup>

                {profileActions}
                </Card>
            </Col>

            <Col className="right">
                <div className="carousel-container">
                    <Slider {...settings}>
                    <div>
                        <img src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg"></img>
                    </div>
                    <div>
                        <img src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg"></img>
                    </div>
                    <div>
                        <img src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg"></img>
                    </div>
                    <div>
                        <img src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg"></img>
                    </div>
                    </Slider>
                </div>

                <Card className="bio-box">
                    <Card.Header>Bio</Card.Header>
                    <Card.Body>
                        {petInfo.bio}
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}

