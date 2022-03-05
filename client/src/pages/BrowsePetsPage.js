import { useCallback, useEffect, useMemo, useState } from 'react';

import AnimalConsts from '../consts/Animal';
import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import PetSearchResult from '../components/pets/PetSearchResult';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import './css/Common.css';
import './css/BrowsePetsPage.css';


const BrowsePetsPage = (props) => {

  const {
    auth
  } = props;

  const getOriginalInputs = useMemo(() => {

    return {
      type: 'any',
      breed: 'any',
      age: 'any',
      gender: 'any',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      availability: 'available',
      sortOrder: 'dateCreated'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(true);
  const [petToDelete, setPetToDelete] = useState(null);
  const [searchData, setSearchData] = useState([]);

  const afterGetSearchResults = useCallback((response) => {

    setIsLoading(false);
    const { error, result } = response;

    if (error) {
      // Handle error
      return;
    }

    else {
      // Set inputs to pet values
      let newSearchData = result.map((rslt) => {

        if (!rslt.disposition) {
          rslt.disposition = [];
        }
        else if (typeof rslt.disposition === 'string') {
          rslt.disposition = [rslt.disposition];
        }

        if (!rslt.images) {
          rslt.images = [];
        }

        if (!rslt.breed) {
          rslt.breed = 'other';
        }

        if (!rslt.type) {
          rslt.type = 'other';
        }

        if (!rslt.age) {
          rslt.age = 'adult';
        }

        if (!rslt.gender) {
          rslt.gender = 'n/a';
        }

        return rslt;
      });

      if (inputs.sortOrder === 'name') {
        newSearchData.sort(
          (a, b) => a.animalName.toLowerCase().localeCompare(b.animalName.toLowerCase())
        );
      }

      else if (inputs.sortOrder === 'type') {
        newSearchData.sort((a, b) => {

          if (a.type === b.type) {
            return a.breed.toLowerCase().localeCompare(b.breed.toLowerCase());
          }

          return a.type.toLowerCase().localeCompare(b.type.toLowerCase());
        });
      }

      else if (inputs.sortOrder === 'age') {
        const petAges = ['baby', 'young', 'adunt', 'senior'];

        newSearchData.sort((a, b) => petAges.indexOf(a.age) - petAges.indexOf(b.age));
      }

      console.log(newSearchData);
      setSearchData(newSearchData);
    }
  }, [inputs]);

  const handleSearch = useCallback(() => {

    setIsLoading(true);
    api.Animal.search().then(afterGetSearchResults);
  }, [afterGetSearchResults]);

  useEffect(() => {

    // Run a search whenever the component loads or inputs.sortOrder changes
    handleSearch();
  }, [handleSearch, inputs.sortOrder]);

  const handleValueChange = useCallback((evt) => {

    const target = evt.currentTarget;

    const field = target.name;
    const value = (target.type === 'checkbox') ? target.checked : target.value;

    const extraInputs = {};
    if (field === 'type') {
      extraInputs.breed = 'any';
    }

    setInputs((prevInputs) => ({ ...prevInputs, ...extraInputs, [field]: value }));
  }, []);

  const handleCloseDeletePetDialog = useCallback(() => setPetToDelete(null), []);

  const handleShowDeletePetDialog = useCallback((id, name) => setPetToDelete({ id, name }), []);

  const handleConfirmDeletePet = useCallback(() => {
  
    api.Animal.delete(petToDelete.id).then(handleSearch);
    handleCloseDeletePetDialog();
  }, [handleCloseDeletePetDialog, handleSearch, petToDelete]);

  const breedSelect = useMemo(() => {

    if (inputs.type === 'other' || inputs.type === 'any') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ?
      AnimalConsts.dogBreedsToDisplayNameMap :
      AnimalConsts.catBreedsToDisplayNameMap;
    const options = Object.entries(breedNamesMap).map(([ breed, displayName ]) => {

      return <option key={breed} value={breed}>{displayName}</option>;
    });

    options.unshift(<option key="any" value="any">Any</option>)

    return (
      <FloatingLabel controlId="floatingSelect" label="Breed">
        <Form.Select
          onChange={handleValueChange}
          name="breed"
          defaultValue="any"
        >
          {options}
        </Form.Select>
      </FloatingLabel>
    );
  }, [inputs, handleValueChange]);

  const searchControls = useMemo(() => {

    return (
      <div
        className={
          'fields p-5 d-flex flex-column justify-content-between ' +
          'align-items-right petSearchControls'
        }
      >

        <FloatingLabel controlId="floatingSelect" label="Age">
          <Form.Select
            onChange={handleValueChange}
            name="age"
            defaultValue={inputs.age}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="baby">{AnimalConsts.ageToDisplayNameMap.baby}</option>
            <option value="young">{AnimalConsts.ageToDisplayNameMap.young}</option>
            <option value="adult">{AnimalConsts.ageToDisplayNameMap.adult}</option>
            <option value="senior">{AnimalConsts.ageToDisplayNameMap.senior}</option>
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel controlId="floatingSelect" label="Gender">
          <Form.Select
            onChange={handleValueChange}
            name="gender"
            defaultValue={inputs.gender}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="n/a">{AnimalConsts.genderToDisplayNameMap['n/a']}</option>
            <option value="male">{AnimalConsts.genderToDisplayNameMap.male}</option>
            <option value="female">{AnimalConsts.genderToDisplayNameMap.female}</option>
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel controlId="floatingSelect" label="Type">
          <Form.Select
            onChange={handleValueChange}
            name="type"
            defaultValue={inputs.type}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="dog">{AnimalConsts.typeToDisplayNameMap.dog}</option>
            <option value="cat">{AnimalConsts.typeToDisplayNameMap.cat}</option>
            <option value="other">{AnimalConsts.typeToDisplayNameMap.other}</option>
          </Form.Select>
        </FloatingLabel>

        {breedSelect}

        <Form.Group className="text-left">
          <Form.Check
            type="checkbox"
            id="goodWithOtherAnimals"
            name="goodWithOtherAnimals"
            label="Good with other animals"
            checked={inputs.goodWithOtherAnimals}
            onChange={handleValueChange}
          />
          <Form.Check
            type="checkbox"
            id="goodWithChildren"
            name="goodWithChildren"
            label="Good with children"
            checked={inputs.goodWithChildren}
            onChange={handleValueChange}
          />
          <Form.Check
            type="checkbox"
            id="mustBeLeashed"
            name="mustBeLeashed"
            label="Must be leashed at all times"
            checked={inputs.mustBeLeashed}
            onChange={handleValueChange}
          />
        </Form.Group>

        <FloatingLabel controlId="floatingSelect" label="Availability">
          <Form.Select
            onChange={handleValueChange}
            name="availability"
            defaultValue={inputs.availability}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="available">{AnimalConsts.availabilityToDisplayNameMap.available}</option>
            <option value="notAvailable">{AnimalConsts.availabilityToDisplayNameMap.notAvailable}</option>
            <option value="pending">{AnimalConsts.availabilityToDisplayNameMap.pending}</option>
            <option value="adopted">{AnimalConsts.availabilityToDisplayNameMap.adopted}</option>
          </Form.Select>
        </FloatingLabel>

        <Button size="md" variant="primary" onClick={handleSearch}>Search</Button>
      </div>
    );
  }, [breedSelect, handleSearch, handleValueChange, inputs]);

  const searchResults = useMemo(() => {

    if (isLoading) {
      return 'Searching...';
    }
    else if (!searchData?.length) {
      return 'No matching results found';
    }

    const resultComponents = searchData.map((pet) => {

      const canDate = (
        auth.currentUser &&
        !auth.isShelterOwner &&
        pet.availability === AnimalConsts.availabilityTypes.available
      );

      return (
        <div key={pet.id}>
          <PetSearchResult
            id={pet.id}
            name={pet.animalName}
            age={pet.age}
            breed={pet.breed}
            canDate={canDate}
            canDelete={auth.isAdmin}
            dateInfo={(auth.currentUser) ? pet.dateInfo : null}
            type={pet.type}
            avatarUrl={pet.avatarUrl}
            images={pet.images || []}
            availability={pet.availability}
            gender={pet.gender}
            disposition={pet.disposition || []}
            onDelete={handleShowDeletePetDialog}
          />
        </div>
      );
    });

    return (
      <div className="d-flex flex-column w-100">
        <Form.Select
          className="sortOrderSelect mr-3"
          onChange={handleValueChange}
          name="sortOrder"
          defaultValue={inputs.sortOrder}
          size="sm"
        >
          <option value="dateCreated">Newest First</option>
          <option value="name">Name First</option>
          <option value="type">Type First</option>
          <option value="age">Age First</option>
        </Form.Select>
        <div className="d-flex flex-wrap">
          {resultComponents}
        </div>
      </div>
    );
  }, [
    auth,
    handleShowDeletePetDialog,
    handleValueChange,
    inputs,
    isLoading,
    searchData
  ]);


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

  const componentOutput = useMemo(() => {

    return (
      <Container fluid>
        <Row>
          <h1 className="display-4 mt-2">Browse Pets</h1>
        </Row>
        <Row>
          <Col md="auto">{searchControls}</Col>
          <Col>{searchResults}</Col>
        </Row>
        {confirmDeleteModal}
      </Container>
    );
  }, [
    confirmDeleteModal,
    searchControls,
    searchResults
  ]);

  return componentOutput;
}

export default BrowsePetsPage;
