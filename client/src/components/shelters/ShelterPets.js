import React, { useCallback, useEffect, useState, useMemo} from 'react';
import {Row, Spinner, Button} from 'react-bootstrap';
import AnimalConsts from '../../consts/Animal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import PetSearchResult from '../pets/PetSearchResult';
import api from '../../api/api';

export default function ShelterPets(props) {
    const [pets, setPets] = useState([]);
    const [petToDelete, setPetToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
      auth, setView
    } = props;
    

    useEffect(() => {
      // Grab images from S3
      api.Animal.getAnimalsByShelter(props.shelterName).then((response) => {
        if(response.error){
          return;
        }
        else{
          setPets(response.result);
          
          if(props.setCount) {
            var count = 0;
            for(var pet of response.result){
              if(pet.availability == "available")
                count++;
            }
            props.setCount(count);
          }
          setLoading(false)
        }
      })
  }, []);

  const handleCloseDeletePetDialog = useCallback(() => setPetToDelete(null), []);

  const handleShowDeletePetDialog = useCallback((id, name) => setPetToDelete({ id, name }), []);

  const handleConfirmDeletePet = useCallback(() => {
  
    handleCloseDeletePetDialog();
  }, [handleCloseDeletePetDialog]);

  const petCards = useMemo(()=>{
      if (!pets.length) {
          return 'No matching results found'
      }
      var results = pets.map((pet) => {
  
        const canDate = (
          auth.currentUser &&
          !auth.isShelterOwner &&
          pet.availability === AnimalConsts.availabilityTypes.available
        );

          return (
            <div key={pet.animalName_shelterName}>
              <PetSearchResult
                id={pet.animalName_shelterName}
                name={pet.animalName}
                avatarUrl={pet.avatar}
                age={pet.age}
                breed={pet.breed}
                canDate={canDate}
                canDelete={auth.isAdmin || pet.shelterName === auth.currentUser.shelterName}
                dateInfo={(auth.currentUser) ? pet.dateInfo : null}
                shelterName={pet.shelterName}
                type={pet.type}
                images={pet.images || []}
                availability={pet.availability}
                gender={pet.gender}
                disposition={pet.disposition || []}
                onDelete={handleShowDeletePetDialog}
                usePopover ={false}
                canEdit = {true}
                onEdit = {props.onEdit}
              />
            </div>
          );
      })
      return results;
  }, [auth, handleShowDeletePetDialog, pets]);

  const confirmDeleteModal = useMemo(() => {

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

  if(loading){
    return(
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>);
  }
  else{
    return(
      <div>
        <Row>
          <div className="shelter pets-container">
            <h2>Available Pets</h2>
            {petCards}
          </div>
        </Row>
        {confirmDeleteModal}
      </div>
    );
  }
}


