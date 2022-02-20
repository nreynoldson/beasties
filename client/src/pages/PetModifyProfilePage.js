import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AnimalConsts from '../consts/Animal';
import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import ImageManagement from '../components/images/ImageManagement';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import './css/Common.css';
import './css/PetModifyProfilePage.css';

const {
  goodWithChildren,
  goodWithOtherAnimals,
  mustBeLeashed
} = AnimalConsts.dispositions;

const PetModifyProfilePage = (props) => {

  const navigate = useNavigate();

  const {
    auth
  } = props;

  const params = useParams();
  const petId = parseInt(params.petId);
  const isNewPet = !petId;

  const originalInputs = useMemo(() => {

    return {
      name: '',
      type: 'other',
      breed: 'other',
      age: 'baby',
      gender: 'n/a',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      availability: 'available',
      bio: ''
    };
  }, []);

  const originalInvalidFields = useMemo(() => {

    return {
      name: false
    };
  }, []);

  const [inputs, setInputs] = useState(originalInputs);
  const [invalidFields, setInvalidFields] = useState(originalInvalidFields);
  const [isLoading, setIsLoading] = useState(!isNewPet);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  const afterGetPetInfo = useCallback((response) => {

    if (response.error) {
      // Handle error
      return;
    }

    const newInputs = { ...response.result };
    delete newInputs.disposition;

    const dispositions = response.result.disposition;
    newInputs.goodWithOtherAnimals = dispositions.includes(goodWithOtherAnimals);
    newInputs.goodWithChildren = dispositions.includes(goodWithChildren);
    newInputs.mustBeLeashed = dispositions.includes(mustBeLeashed);

    setInputs(newInputs);
    setIsLoading(false);
  }, []);

  const afterSubmit = useCallback((response) => {

    if (response.error) {
      // Handle error
      return;
    }

    else {
      // Navigate to pet profile page
      navigate(`/pet/${response.result.id}`);
    }
  }, [navigate]);

  useEffect(() => {

    if (!isNewPet) {
      // api.Animal.getInfo(petId).then(afterGetPetInfo);

      const dummyData = {
        id: petId,
        name: 'Fido',
        type: 'dog',
        breed: 'greatDane',
        age: 'young',
        gender: 'Male',
        disposition: [
          goodWithChildren,
          goodWithOtherAnimals
        ],
        availability: 'pending',
        bio: 'This is my bio'
      };

      api.Dummy.returnThisData(dummyData).then(afterGetPetInfo);
    }
  }, [afterGetPetInfo, isNewPet, petId]);

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

    if (!inputs.name.length) {
      setInvalidFields({ ...invalidFields, name: true });
      return;
    }
    else {
      setInvalidFields(originalInvalidFields);
    }

    if (isNewPet) {
      // api.Animal.create(inputs).then(afterSubmit);
      api.Dummy.returnThisData({ id: 1 }).then(afterSubmit);
    }
    else {
      // api.Animal.edit(inputs).then(afterSubmit);
      api.Dummy.returnThisData({ id: 1 }).then(afterSubmit);
    }
  }, [
    afterSubmit,
    inputs.name,
    invalidFields,
    isNewPet,
    originalInvalidFields
  ]);

  const handleShowConfirmDeleteDialog =
    useCallback(() => setShowConfirmDeleteDialog(true), []);

  const handleCloseDeleteDialog =
    useCallback(() => setShowConfirmDeleteDialog(false), []);

  const handleConfirmDelete = useCallback(() => {
    
    setShowConfirmDeleteDialog(false);
    api.Animal.delete(petId).then(() => navigate('/browse-pets'));
  }, [navigate, petId]);

  const breedSelect = useMemo(() => {

    if (inputs.type === 'other') {
      return null;
    }

    const breedNamesMap = (inputs.type === 'dog') ?
      AnimalConsts.dogBreedsToDisplayNameMap :
      AnimalConsts.catBreedsToDisplayNameMap;
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

  const confirmDeleteModal = useMemo(() => {

    if (isNewPet) {
      return null;
    }

    return (
      <ConfirmDeleteModal
        bodyText="Really delete this pet?"
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        show={showConfirmDeleteDialog}
        title="Confirm Delete Pet"
      />
    );
  }, [handleCloseDeleteDialog, handleConfirmDelete, isNewPet, showConfirmDeleteDialog]);

  const componentOutput = useMemo(() => {

    if (isLoading) {
      return (
        <div>
            <h1>Loading...</h1>
        </div>
      );
    }

    let deleteButton = null;
    if (auth.isAdmin) {
      deleteButton = (
        <Button
          className="mt-4 mb-4"
          size="sm"
          variant="danger"
          onClick={handleShowConfirmDeleteDialog}
        >
          Delete Pet
        </Button>
      );
    }

    let imageManagement = null;
    if (petId) {
      imageManagement = (
        <ImageManagement
          allowEdit={true}
          id={petId}
          type="animal"
        />
      );
    }

    return (
      <div className="d-flex flex-column align-items-center">
        <h1 className="display-4 mt-2">{(isNewPet) ? 'Add' : 'Edit'} Pet</h1>
        <div className="fields p-5 d-flex flex-column justify-content-between align-items-right w-75">
          <FloatingLabel controlId="floatingInput" label="Name">
            <Form.Control
              required
              isInvalid={invalidFields.name}
              type="text"
              onChange={handleValueChange}
              name="name"
              value={inputs.name}
              placeholder="Name"
              size="lg"
              />
            <Form.Control.Feedback type="invalid">
              Name is required
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Age">
            <Form.Select
              onChange={handleValueChange}
              name="age"
              defaultValue={inputs.age}
              size="lg"
            >
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
              size="lg"
            >
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
              size="lg"
            >
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
              size="lg"
            >
              <option value="available">{AnimalConsts.availabilityToDisplayNameMap.available}</option>
              <option value="notAvailable">{AnimalConsts.availabilityToDisplayNameMap.notAvailable}</option>
              <option value="pending">{AnimalConsts.availabilityToDisplayNameMap.pending}</option>
              <option value="adopted">{AnimalConsts.availabilityToDisplayNameMap.adopted}</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingTextarea" label="Bio">
            <Form.Control
              as="textarea"
              className="bioTextArea"
              name="bio"
              onChange={handleValueChange}
              placeholder="Leave a comment here"
              value={inputs.bio}
            />
          </FloatingLabel>

        </div>

        {deleteButton}

        {imageManagement}

        <Button
          className="mb-3"
          size="lg"
          variant="primary"
          onClick={handleSubmit}
        >
          Save Pet
        </Button>
        {confirmDeleteModal}
      </div>
    );
  }, [
    auth.isAdmin,
    breedSelect,
    confirmDeleteModal,
    handleShowConfirmDeleteDialog,
    handleSubmit,
    handleValueChange,
    inputs,
    invalidFields,
    isLoading,
    isNewPet,
    petId
  ]);

  return componentOutput;
}

export default PetModifyProfilePage;
