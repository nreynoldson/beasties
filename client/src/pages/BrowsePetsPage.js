import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import PetConsts from '../consts/Pets';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import './css/Common.css';
import './css/BrowsePetsPage.css';


const BrowsePetsPage = (props) => {

  const params = useParams();
  const petId = parseInt(params.petId);
  const isNewPet = !petId;

  const getOriginalInputs = useMemo(() => {

    return {
      type: 'any',
      breed: 'any',
      age: null,
      gender: 'any',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      availability: 'any'
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

  useEffect(() => {

    // Perform initial search
      setPetData({ results: [] });
  }, []);

  const handleValueChange = useCallback((evt) => {

    const target = evt.currentTarget;

    const field = target.name;
    const value = (target.type === 'checkbox') ? target.checked : target.value;

    setInputs((prevInputs) => ({ ...prevInputs, [field]: value }));
  }, []);

  const handleSearchClick = useCallback(() => {

  }, []);

  const breedSelect = useMemo(() => {

    if (inputs.type === 'other' || inputs.type === 'any') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ? PetConsts.dogBreedsMap : PetConsts.catBreedsMap;
    const options = Object.entries(breedNamesMap).map(([ breed, displayName ]) => {

      return <option key={breed} value={breed}>{displayName}</option>;
    });

    return (
      <FloatingLabel controlId="floatingSelect" label="Breed">
        <Form.Select
          onChange={handleValueChange}
          name="breed"
          defaultValue={inputs.breed}
        >
          {options}
        </Form.Select>
      </FloatingLabel>
    );
  }, [inputs, handleValueChange]);

  const searchControls = useMemo(() => {

    return (
      <div className="fields p-5 d-flex flex-column justify-content-between align-items-right searchControls">

          <FloatingLabel controlId="floatingInput" label="Age">
            <Form.Control
              type="number"
              onChange={handleValueChange}
              name="age"
              value={inputs.age}
              placeholder="Age"
              size="lg"
              />
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Gender">
            <Form.Select
              onChange={handleValueChange}
              name="gender"
              defaultValue={inputs.gender}
              size="lg"
            >
              <option value="any">Any</option>
              <option value="n/a">N/A</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Type">
            <Form.Select
              onChange={handleValueChange}
              name="type"
              defaultValue={inputs.type}
              size="lg"
            >
              <option value="any">Any</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
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
              size="lg"
            >
              <option value="any">Any</option>
              <option value="available">Available</option>
              <option value="notAvailable">Not Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </Form.Select>
          </FloatingLabel>

          <Button size="md" variant="primary" onClick={handleSearchClick}>Submit</Button>
        </div>
    );
  }, []);

  const searchResults = useMemo(() => {

    if (!petData?.results?.length) {
      return 'No matching results found'
    }
  }, []);

  const componentOutput = useMemo(() => {

    return (
      <div>
        <h1 className="display-4 mt-2">Search Pets</h1>
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
