import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AnimalConsts from '../consts/Animal';
import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import ImageManagement from '../components/images/ImageManagement';

import {Button, Form, FloatingLabel, Alert} from 'react-bootstrap';

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
    auth,
    petName,
    shelterName
  } = props;

 // const { petName, shelterName } = useParams();
  const isNewPet = !petName;

  const originalInputs = useMemo(() => {

    return {
      animalName: '',
      avatar: '',
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
      animalName: false
    };
  }, []);

  const [inputs, setInputs] = useState(originalInputs);
  const [invalidFields, setInvalidFields] = useState(originalInvalidFields);
  const [isLoading, setIsLoading] = useState(!isNewPet);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  const afterGetPetInfo = useCallback((response) => {

    setIsLoading(false);
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
    newInputs.shelterName = auth.currentUser?.shelterName;

    setInputs(newInputs);
  }, [auth.currentUser]);

  const getPetInfo = useCallback(() => {
  
    api.Animal.getInfo(petName, shelterName).then(afterGetPetInfo);
  }, [afterGetPetInfo, petName, shelterName]);

  const afterSubmit = useCallback((response) => {
    if (response.error) {
      // Handle error
      return;
    }

    if (!isNewPet) {
      getPetInfo();
    }

    else {
      // Navigate to pet profile page
      setSuccess(true);
      setInputs(originalInputs);
      //navigate(`/pet/${response.result.id}`);
    }
  }, [getPetInfo, isNewPet, originalInputs]);

  useEffect(() => {
    if (!isNewPet && auth.currentUser) {
      getPetInfo();
    }
    else{
      setInputs((prevInputs) => ({ ...prevInputs, shelterName: auth.currentUser?.shelterName }));
    }
  }, [afterGetPetInfo, auth.currentUser, isNewPet, getPetInfo]);

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
    if (!inputs.animalName.length) {
      setInvalidFields({ ...invalidFields, animalName: true });
      return;
    }
    else {
      setInvalidFields(originalInvalidFields);
    }

    const params = {...inputs};
    params.disposition = [];
    for(const disposition of Object.values(AnimalConsts.dispositions)){
      if (params[disposition]) {
        params.disposition.push(disposition);
      }
      delete params[disposition];
    }

    delete params.avatar;
    if (isNewPet) {
      api.Animal.create(params).then(afterSubmit);
    }
    else {
      delete params.animalName;
      delete params.animalName_shelterName;
      delete params.shelterName;
      delete params.breed;
      delete params.type;
      delete params.gender;
      api.Animal.edit(petName, shelterName, params).then(afterSubmit);
    }
  }, [
    afterSubmit,
    inputs,
    invalidFields,
    isNewPet,
    originalInvalidFields,
    petName,
    shelterName
  ]);

  const handleShowConfirmDeleteDialog =
    useCallback(() => setShowConfirmDeleteDialog(true), []);

  const handleCloseDeleteDialog =
    useCallback(() => setShowConfirmDeleteDialog(false), []);

  const handleConfirmDelete = useCallback(() => {
    
    setShowConfirmDeleteDialog(false);
    api.Animal.delete(petName, shelterName).then(() => navigate('/browse-pets'));
  }, [navigate, petName, shelterName]);

  const handleUploadAvatar = useCallback((imageFile) => {
  
    api.Animal.uploadImage(inputs.animalName_shelterName).then(({ error, result }) => {

      if (!error) {
        api.Image.uploadImage(result.uploadUrl, imageFile).then(() => {

          // Put a random number after the avatar url to force the image to reload
          setInputs((prevInputs) => ({ ...prevInputs, avatar: `${prevInputs.avatar}?${Math.random()}` }))
        });
      }
    });
  }, [getPetInfo, inputs]);

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
          value={inputs.breed}
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
    if (!isNewPet && auth.isAdmin) {
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
    if (!isNewPet) {
      imageManagement = (
        <ImageManagement
          allowEdit={true}
          avatarImageUrl={inputs.avatar}
          onUploadImage={handleUploadAvatar}
          type="animal"
        />
      );
    }

    return (
      <div className="d-flex flex-column align-items-center">
        {success ? <Alert variant={'success'}>
              Pet added successfully! </Alert> : ''}
        <h1 className="display-4 mt-2">{(isNewPet) ? 'Add' : 'Edit'} Pet</h1>
        <div className="fields p-5 d-flex flex-column justify-content-between align-items-right w-75">
          <FloatingLabel controlId="floatingInput" label="Name">
            <Form.Control
              required
              isInvalid={invalidFields.animalName}
              type="text"
              onChange={handleValueChange}
              name="animalName"
              value={inputs.animalName}
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
              value={inputs.age}
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
              value={inputs.gender}
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
              value={inputs.type}
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
              value={inputs.availability}
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
    handleUploadAvatar,
    handleValueChange,
    inputs,
    invalidFields,
    isLoading,
    isNewPet,
    petName,
    shelterName,
    success
  ]);

  return componentOutput;
}

export default PetModifyProfilePage;
