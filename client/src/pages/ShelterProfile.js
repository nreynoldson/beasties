import React, { useCallback, useEffect, useState, useMemo} from 'react';

import AnimalConsts from '../consts/Animal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import {Container, Card, ListGroup, Row, Col, Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import './css/ShelterProfile.css';
import PetSearchResult from '../components/pets/PetSearchResult';
<<<<<<< HEAD
import ShelterPets from '../components/shelters/ShelterPets';

export default function ShelterProfile(props) {
    const { shelterId } = useParams();
=======

const {
  goodWithChildren,
  goodWithOtherAnimals,
  mustBeLeashed
} = AnimalConsts.dispositions;

var testData = { results: [
    {
      id: 1,
      name: 'Fido',
      age: 'young',
      gender: 'male',
      type: 'dog',
      breed: 'englishSpringerSpaniel',
      availability: 'available',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [
        goodWithChildren,
        goodWithOtherAnimals,
        mustBeLeashed,
      ],
      images: []
    },
    {
      id: 2,
      name: 'Rex',
      age: 'young',
      gender: 'male',
      type: 'dog',
      breed: 'akita',
      availability: 'available',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [],
      images: []
    },
    {
      id: 3,
      name: 'Milly',
      age: 'senior',
      gender: 'female',
      type: 'dog',
      breed: 'cavalierKingCharlesSpaniel',
      availability: 'available',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [mustBeLeashed],
      images: [
        {
          id: 1,
          url: '/images/no_image.svg',
          displayName: 'fido.jpg'
        },
        {
          id: 2,
          url: '/images/no_image.svg',
          displayName: 'fido.jpg'
        },
        {
          id: 3,
          url: '/images/no_image.svg',
          displayName: 'fido.jpg'
        }
      ]
    },
    {
      id: 4,
      name: 'Sam',
      age: 'adult',
      gender: 'male',
      type: 'cat',
      breed: 'norwegianForestCat',
      availability: 'available',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [],
      images: []
    },
    {
      id: 5,
      name: 'Lizzy',
      age: 'young',
      gender: 'female',
      type: 'other',
      breed: null,
      availability: 'pending',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [],
      images: []
    },
    {
      id: 6,
      name: 'Benny',
      age: 'baby',
      gender: 'male',
      type: 'cat',
      breed: 'other',
      availability: 'available',
      avatarUrl: null,
      dateCreated: '2022-01-23T18:44:20.051Z',
      disposition: [],
      images: []
    }
  ] };
console.log(testData);

export default function ShelterProfile(props) {
    const { petId } = useParams();
    const [pets, setPets] = useState({});
    const [petToDelete, setPetToDelete] = useState(null);

    const {
      auth
    } = props;
    

    useEffect(() => {
        // Request the necessary data from the back end
        // Grab images from S3
        var petData = {...testData};
        setPets(petData);
    }, []);

    const handleCloseDeletePetDialog = useCallback(() => setPetToDelete(null), []);

    const handleShowDeletePetDialog = useCallback((id, name) => setPetToDelete({ id, name }), []);

    const handleConfirmDeletePet = useCallback(() => {
    
      handleCloseDeletePetDialog();
    }, [handleCloseDeletePetDialog]);

    const petCards = useMemo(()=>{
        if (!pets?.results?.length) {
            return 'No matching results found'
        }
        var results = pets.results.map((pet) => {
    
          const canDate = (
            auth.currentUser &&
            !auth.isShelterOwner &&
            pet.availability === AnimalConsts.availabilityTypes.available
          );

            return (
              <div key={pet.id}>
                <PetSearchResult
                  id={pet.id}
                  name={pet.name}
                  age={pet.age}
                  breed={pet.breed}
                  canDate={canDate}
                  canDelete={auth.isAdmin}
                  dateInfo={(auth.currentUser) ? pet.dateInfo : null}
                  type={pet.type}
                  avatarUrl={pet.avatarUrl}
                  images={pet.images}
                  availability={pet.availability}
                  gender={pet.gender}
                  disposition={pet.disposition}
                  onDelete={handleShowDeletePetDialog}
                />
              </div>
            );
        })
        return results;
    }, [auth, handleShowDeletePetDialog, pets]);

    
    const confirmDeleteModal = useMemo(() => {

      if (!auth.isAdmin) {
        return null;
      }

      return (
        <ConfirmDeleteModal
          bodyText={`Really delete "${petToDelete?.name}"?`}
          onClose={handleCloseDeletePetDialog}
          onConfirm={handleConfirmDeletePet}
          show={Boolean(petToDelete)}
          title="Confirm Delete Pet"
        />
      );
    }, [
      auth.isAdmin,
      handleCloseDeletePetDialog,
      handleConfirmDeletePet,
      petToDelete
    ]);

>>>>>>> origin/master
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

            <Row>
                <ShelterPets shelter={shelterId}/>
            </Row>
            {confirmDeleteModal}
        </Container>
    );
}
