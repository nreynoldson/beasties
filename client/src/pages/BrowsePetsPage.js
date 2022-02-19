import { useCallback, useEffect, useMemo, useState } from 'react';

import AnimalConsts from '../consts/Animal';
import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import PetSearchResult from '../components/pets/PetSearchResult';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

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
  const [searchData, setSearchData] = useState({ results: [] });

  const afterGetSearchResults = useCallback((response) => {

    if (response.error) {
      // Handle error
      return;
    }

    else {
      // Set inputs to pet values
      setSearchData(response.result);
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {

    setIsLoading(true);
    // api.Animal.search(inputs).then(afterGetSearchResults);

    const {
      goodWithChildren,
      goodWithOtherAnimals,
      mustBeLeashed
    } = AnimalConsts.dispositions;

    const dummyResults = {
      results: [
        {
          id: 1,
          name: 'Fido',
          age: 'young',
          gender: 'male',
          type: 'dog',
          breed: 'englishSpringerSpaniel',
          availability: 'available',
          dateInfo: null,
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
          dateInfo: null,
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
          dateInfo: null,
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
          dateInfo: {
            id: 1,
            startDate: '2022-03-23T18:44:20.051Z',
            endDate: '2022-03-25T18:44:20.051Z'
          },
          availability: 'notAvailable',
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
          dateInfo: null,
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
          dateInfo: null,
          avatarUrl: null,
          dateCreated: '2022-01-23T18:44:20.051Z',
          disposition: [],
          images: []
        }
      ]
    };

    api.Dummy.returnThisData(dummyResults).then(afterGetSearchResults);
  }, [afterGetSearchResults, inputs]);

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
  
    handleCloseDeletePetDialog();
  }, [handleCloseDeletePetDialog]);

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
          'fields p-5 d-flex flex-column ' +
          'justify-content-between align-items-right searchControls'
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
            label="Animal must be leashed at all times"
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
    else if (!searchData?.results?.length) {
      return 'No matching results found';
    }

    const resultComponents = searchData.results.map((pet) => {

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
      <div>
        <h1 className="display-4 mt-2">Browse Pets</h1>
        <div className="d-flex">
          {searchControls}
          {searchResults}
        </div>
        {confirmDeleteModal}
      </div>
    );
  }, [
    confirmDeleteModal,
    searchControls,
    searchResults
  ]);

  return componentOutput;
}

export default BrowsePetsPage;
