import React, { useEffect, useState, useCallback} from 'react';
import {Container, Card, ListGroup, Col, Button, Image} from 'react-bootstrap';
import LoginButton from '../components/account/LoginButton';
import {RequestButton} from '../components/pets/RequestButtons';
import AnimalConsts from '../consts/Animal';
import { useNavigate, useParams } from 'react-router-dom';
import './css/PetProfile.css';
import api from '../api/api';
import NotFound from './NotFound';

// TODO: need bio, images from backend

export default function PetProfile(props) {
    const { petName, shelterName } = useParams();
    const navigate = useNavigate();
    const [petInfo, setPetInfo] = useState({});
    const [notFound, setNotFound] = useState(false);

    const user = props.auth.currentUser;

    const processPetInfo = useCallback((response) => {
        if (response.error) {
          setNotFound(true);
        }
    
        else {
            var data = response.result;
            var pet = {};

            pet.type = AnimalConsts.typeToDisplayNameMap[data.type];
            if (data.type === 'dog' || data.type === 'cat') {
                const breedToDisplayNameMap = (data.type === 'dog') ?
                    AnimalConsts.dogBreedsToDisplayNameMap :
                    AnimalConsts.catBreedsToDisplayNameMap;
                    pet.breed = breedToDisplayNameMap[data.breed];
            }
            pet.age = AnimalConsts.ageToDisplayNameMap[data.age];
            pet.gender = AnimalConsts.genderToDisplayNameMap[data.gender];
            pet.availability = AnimalConsts.availabilityToDisplayNameMap[data.availability];
            pet.availability = AnimalConsts.availabilityToDisplayNameMap[data.availability];
            pet.name = data.animalName;
            pet.shelter = data.shelterName;
            pet.avatar = data.avatar ? data.avatar : '/images/no-image.png';
            pet.bio = data.bio;
            setPetInfo(pet);
        }
    }, []);

    useEffect(() => {
        // Grab images from S3

        api.Animal.getInfo(petName, shelterName).then(processPetInfo);
       
    }, [petName, shelterName, processPetInfo]);

   const goToEditPage = () => {

        navigate(`/pet/${petName}/${shelterName}/edit`);
    };

    var profileActions = null;
    if(user){
        var editButton = null;
        if (user.isShelterOwner && user.shelterName === shelterName) {
            editButton = (
                <Button onClick={goToEditPage} variant="secondary" className="edit-pet">
                    Edit
                </Button>
            );
        }

        if(!user.isShelterOwner){
            profileActions = (
                <div className="profile-actions"> 
                    <RequestButton auth={props.auth} requestType={'date'} shelterName={shelterName} animalName={petName}/>
                    <RequestButton auth={props.auth} requestType={'adoption'} shelterName={shelterName} animalName={petName}/>
                </div>
            );
        }
    } else{
        profileActions = (
            <div className="profile-actions">
                <span>Login to make a request!</span>
                <LoginButton></LoginButton>
            </div>
        );
    }
    if(notFound){
        return <NotFound/>
    }
    else{
        return(
            <Container className="profile-container">
                <Col xs={4}>
                    <Card className="profile-info">
                    <Card.Header className="pet-name-title">{petInfo.name}</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><span className='label'>Type:</span> <span>{petInfo.type}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Breed:</span> <span>{petInfo.breed}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Age:</span> <span>{petInfo.age}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Gender:</span><span>{petInfo.gender}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Availability:</span><span>{petInfo.availability}</span></ListGroup.Item>
                        <ListGroup.Item><span className='label'>Shelter:</span><span>{petInfo.shelter}</span></ListGroup.Item>
                    </ListGroup>

                    {profileActions}
                    {editButton}
                    </Card>
                </Col>

                <Col className="right" xs={7}>
                    <Image className="profile-avatar" src={petInfo.avatar}></Image>

                    <Card className="bio-box">
                        <Card.Header>Bio</Card.Header>
                        <Card.Body>
                            {petInfo.bio ? petInfo.bio : "There's no bio for " + petInfo.name + " yet! Check back again soon!"}
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }
}

