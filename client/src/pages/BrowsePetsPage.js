import { useCallback, useEffect, useMemo, useState } from 'react';

import PetConsts from '../consts/Pets';
import PetSearchResult from '../components/pets/PetSearchResult';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import './css/Common.css';
import './css/BrowsePetsPage.css';


const BrowsePetsPage = (props) => {

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
      sortOrder: 'newest'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [petData, setPetData] = useState({ results: [] });

  const afterGetPetInfo = useCallback((response) => {

    if (response.err) {
      // Handle error
      return;
    }

    else {
      // Set inputs to pet values
      // setInputs();
      setIsLoading(false);
    }

  }, []);

  const afterSearch = useCallback((response) => {

    if (response.err) {
      // Handle error
      return;
    }

    else {
      // Navigate to pet profile page
    }

  }, []);

  const handleSearch = useCallback(() => {

    // TODO: make this actually search when the back end api is ready
    setPetData({ results: [
      {
        id: 1,
        name: 'Fido',
        age: 'young',
        gender: 'male',
        type: 'dog',
        breed: 'englishSpringerSpaniel',
        availability: 'available',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      },
      {
        id: 2,
        name: 'Rex',
        age: 'young',
        gender: 'male',
        type: 'dog',
        breed: 'akita',
        availability: 'available',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      },
      {
        id: 3,
        name: 'Milly',
        age: 'senior',
        gender: 'female',
        type: 'dog',
        breed: 'cavalierKingCharlesSpaniel',
        availability: 'available',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      },
      {
        id: 4,
        name: 'Sam',
        age: 'adult',
        gender: 'male',
        type: 'cat',
        breed: 'norwegianForestCat',
        availability: 'available',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      },
      {
        id: 5,
        name: 'Lizzy',
        age: 'young',
        gender: 'female',
        type: 'other',
        breed: null,
        availability: 'pending',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      },
      {
        id: 6,
        name: 'Benny',
        age: 'baby',
        gender: 'male',
        type: 'cat',
        breed: 'other',
        availability: 'available',
        imageUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z'
      }
    ] });
  }, []);

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

  const breedSelect = useMemo(() => {

    if (inputs.type === 'other' || inputs.type === 'any') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ?
      PetConsts.dogBreedsToDisplayNameMap :
      PetConsts.catBreedsToDisplayNameMap;
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
            <option value="baby">{PetConsts.ageToDisplayNameMap.baby}</option>
            <option value="young">{PetConsts.ageToDisplayNameMap.young}</option>
            <option value="adult">{PetConsts.ageToDisplayNameMap.adult}</option>
            <option value="senior">{PetConsts.ageToDisplayNameMap.senior}</option>
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
            <option value="n/a">{PetConsts.genderToDisplayNameMap['n/a']}</option>
            <option value="male">{PetConsts.genderToDisplayNameMap.male}</option>
            <option value="female">{PetConsts.genderToDisplayNameMap.female}</option>
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
            <option value="dog">{PetConsts.typeToDisplayNameMap.dog}</option>
            <option value="cat">{PetConsts.typeToDisplayNameMap.cat}</option>
            <option value="other">{PetConsts.typeToDisplayNameMap.other}</option>
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
            <option value="available">{PetConsts.availabilityToDisplayNameMap.available}</option>
            <option value="notAvailable">{PetConsts.availabilityToDisplayNameMap.notAvailable}</option>
            <option value="pending">{PetConsts.availabilityToDisplayNameMap.pending}</option>
            <option value="adopted">{PetConsts.availabilityToDisplayNameMap.adopted}</option>
          </Form.Select>
        </FloatingLabel>

        <Button size="md" variant="primary" onClick={handleSearch}>Search</Button>
      </div>
    );
  }, [breedSelect, handleSearch, handleValueChange, inputs]);

  const searchResults = useMemo(() => {

    if (!petData?.results?.length) {
      return 'No matching results found'
    }

    const resultComponents = petData.results.map((pet) => {

      return (
        <div key={pet.id}>
          <PetSearchResult
            id={pet.id}
            name={pet.name}
            age={pet.age}
            breed={pet.breed}
            type={pet.type}
            imageUrl={pet.imageUrl}
          />
        </div>
      );
    });

    return (
      <div className="d-flex flex-column">
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
  }, [handleValueChange, inputs, petData]);

  const componentOutput = useMemo(() => {

    return (
      <div>
        <h1 className="display-4 mt-2">Browse Pets</h1>
        <div className="d-flex">
          {searchControls}
          {searchResults}
        </div>
      </div>
    );
  }, [searchControls, searchResults]);

  return componentOutput;
}

export default BrowsePetsPage;
