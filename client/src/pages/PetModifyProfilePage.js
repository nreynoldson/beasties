import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import PetConsts from '../consts/Pets';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import './css/Common.css';
import './css/PetModifyProfilePage.css';


const PetModifyProfilePage = (props) => {

  const params = useParams();
  const petId = parseInt(params.petId);
  const isNewPet = !petId;

  const getOriginalInputs = useMemo(() => {

    return {
      name: '',
      type: 'other',
      breed: 'other',
      age: 'baby',
      gender: 'n/a',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      availability: 'available'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(!isNewPet);

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

  const afterSubmit = useCallback((response) => {

    if (response.err) {
      // Handle error
      return;
    }

    else {
      // Navigate to pet profile page
    }
  }, []);

  useEffect(() => {

    if (!isNewPet) {
      // make api request and pass result to afterGetPetInfo
    }
  }, [isNewPet, petId]);

  const handleValueChange = useCallback((evt) => {

    const target = evt.currentTarget;

    const field = target.name;
    const value = (target.type === 'checkbox') ? target.checked : target.value;

    const extraInputs = {};
    if (field === 'type') {
      extraInputs.breed = 'other';
    }

    setInputs((prevInputs) => ({ ...prevInputs, ...extraInputs, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {

    if (isNewPet) {
      // Use create route
    }
    else {
      // Use edit route
    }
  }, [isNewPet]);

  const breedSelect = useMemo(() => {

    if (inputs.type === 'other') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ?
      PetConsts.dogBreedsToDisplayNameMap :
      PetConsts.catBreedsToDisplayNameMap;
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

  const componentOutput = useMemo(() => {

    return (
      <Fragment>
        <h1 className="display-4 mt-2">{(isNewPet) ? 'Add' : 'Edit'} Pet</h1>
        <div className="fields p-5 d-flex flex-column justify-content-between align-items-right">
          <FloatingLabel controlId="floatingInput" label="Name">
            <Form.Control
              type="text"
              onChange={handleValueChange}
              name="name"
              value={inputs.name}
              placeholder="Name"
              size="lg"
              />
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Age">
            <Form.Select
              onChange={handleValueChange}
              name="age"
              defaultValue={inputs.age}
              size="lg"
            >
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
              size="lg"
            >
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
              size="lg"
            >
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
              size="lg"
            >
              <option value="available">{PetConsts.availabilityToDisplayNameMap.available}</option>
              <option value="notAvailable">{PetConsts.availabilityToDisplayNameMap.notAvailable}</option>
              <option value="pending">{PetConsts.availabilityToDisplayNameMap.pending}</option>
              <option value="adopted">{PetConsts.availabilityToDisplayNameMap.adopted}</option>
            </Form.Select>
          </FloatingLabel>
        </div>

        <Button size="lg" variant="primary" onClick={handleSubmit}>Submit</Button>
      </Fragment>
    );
  }, [breedSelect, handleSubmit, handleValueChange, inputs, isNewPet]);

  return componentOutput;
}

export default PetModifyProfilePage;
