import React, { useCallback, useEffect, useState, useMemo} from 'react';
import {Row} from 'react-bootstrap';
import AnimalConsts from '../../consts/Animal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import PetSearchResult from '../pets/PetSearchResult';
import api from '../../api/api';
import { usePromiseTracker } from 'react-promise-tracker';

export default function ShelterPets(props) {
    const [pets, setPets] = useState([]);
    const [petToDelete, setPetToDelete] = useState(null);
    const promiseInProgress = usePromiseTracker();

    const {
      auth
    } = props;
    

    useEffect(() => {
      // Request the necessary data from the back end
      // Grab images from S3
      api.Animal.getAnimalsByShelter(props.shelterName).then((response) => {
        console.log(response);
        if(response.error){
          return;
        }
        else{
          setPets(response.result)
        }
      })
  }, []);

  const handleCloseDeletePetDialog = useCallback(() => setPetToDelete(null), []);

  const handleShowDeletePetDialog = useCallback((id, name) => setPetToDelete({ id, name }), []);

  const handleConfirmDeletePet = useCallback(() => {
  
    handleCloseDeletePetDialog();
  }, [handleCloseDeletePetDialog]);

  const petCards = useMemo(()=>{
    console.log(pets);
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
                usePopover ={false}
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

    return(
      <div>
        <Row>
          <div className="shelter pets-container">
            {petCards}
          </div>
        </Row>
        {confirmDeleteModal}
      </div>
    );
}
