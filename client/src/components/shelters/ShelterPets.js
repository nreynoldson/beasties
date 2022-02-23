import React, { useEffect, useState, useMemo} from 'react';
import {Container, Card, ListGroup, Row, Col, Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import PetSearchResult from '../pets/PetSearchResult';

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
      goodWithChildren: true,
      goodWithOtherAnimals: true,
      mustBeLeashed: true,
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
      goodWithChildren: false,
      goodWithOtherAnimals: false,
      mustBeLeashed: false,
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
      goodWithChildren: false,
      goodWithOtherAnimals: false,
      mustBeLeashed: true,
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
      goodWithChildren: false,
      goodWithOtherAnimals: false,
      mustBeLeashed: false,
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
      goodWithChildren: false,
      goodWithOtherAnimals: false,
      mustBeLeashed: false,
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
      goodWithChildren: false,
      goodWithOtherAnimals: false,
      mustBeLeashed: false,
      images: []
    }
  ] };
console.log(testData);

export default function ShelterPets(props) {
    const [pets, setPets] = useState({});
    const [canEdit, setCanEdit] = useState(false);
    

    useEffect(async () => {
        // Request the necessary data from the back en
        console.log(props);
        //var user = props.auth.currentUser;
       // var petData = {...testData};
       // setPets(petData);
        /*if(user.isShelter && user.shelterName == props.shelterName){
          setCanEdit(true);
        }*/
    }, []);

    const petCards = useMemo(()=>{
        if (!pets?.results?.length) {
            return 'No matching results found'
        }
        var results = pets.results.map((pet) => {
    
            return (
              <div key={pet.id}>
                <PetSearchResult
                  id={pet.id}
                  name={pet.name}
                  age={pet.age}
                  breed={pet.breed}
                  type={pet.type}
                  avatarUrl={pet.avatarUrl}
                  images={pet.images}
                  availability={pet.availability}
                  gender={pet.gender}
                  goodWithChildren={pet.goodWithChildren}
                  goodWithOtherAnimals={pet.goodWithOtherAnimals}
                  mustBeLeashed={pet.mustBeLeashed}
                />
              </div>
            );
        })
        return results;
    }, [pets]);

    return(
        <div className="shelter pets-container">
            {petCards}
        </div>
    );
}
