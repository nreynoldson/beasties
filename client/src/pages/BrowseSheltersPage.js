import { useCallback, useEffect, useMemo, useState } from 'react';

import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import ShelterSearchResult from '../components/shelters/ShelterSearchResult';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import './css/Common.css';
import './css/BrowseSheltersPage.css';


const BrowseSheltersPage = (props) => {

  const {
    auth
  } = props;

  const getOriginalInputs = useMemo(() => {

    return {
      name: '',
      availableAnimals: 'any',
      sortOrder: 'availableAnimals'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState({ results: [] });
  const [shelterToDelete, setShelterToDelete] = useState(null);

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
    // api.Shelter.search(inputs).then(afterGetSearchResults);

    const dummyResults = {
      results: [
        {
          id: 1,
          name: 'Bob\'s Pets',
          avatarUrl: null,
          dateCreated: '2022-01-23T18:44:20.051Z',
          availableAnimals: 250
        },
        {
          id: 2,
          name: 'Critters',
          avatarUrl: null,
          dateCreated: '2022-01-23T18:44:20.051Z',
          availableAnimals: 130
        },
        {
          id: 3,
          name: 'Paw Pals',
          avatarUrl: null,
          dateCreated: '2022-01-23T18:44:20.051Z',
          availableAnimals: 23
        },
        {
          id: 4,
          name: 'Doug\'s Dogs',
          avatarUrl: null,
          dateCreated: '2022-01-23T18:44:20.051Z',
          availableAnimals: 5
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


  const handleCloseDeleteShelterDialog = useCallback(() => setShelterToDelete(null), []);

  const handleShowDeleteShelterDialog = useCallback((id, name) => setShelterToDelete({ id, name }), []);

  const handleConfirmDeleteShelter = useCallback(() => {
  
    api.Shelter.delete(shelterToDelete.id).then(handleSearch);
    handleCloseDeleteShelterDialog();
  }, [handleCloseDeleteShelterDialog, handleSearch, shelterToDelete]);


  const searchControls = useMemo(() => {

    return (
      <div
        className={
          'fields p-5 d-flex flex-column justify-content-between ' +
          'align-items-right shelterSearchControls'
        }
      >

        <FloatingLabel controlId="floatingInput" label="Name">
          <Form.Control
            type="text"
            value={inputs.name}
            onChange={handleValueChange}
            name="name"
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingSelect" label="Minimum available pets">
          <Form.Select
            onChange={handleValueChange}
            name="availableAnimals"
            defaultValue={inputs.availableAnimals}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100+">100+</option>
          </Form.Select>
        </FloatingLabel>

        <Button size="md" variant="primary" onClick={handleSearch}>Search</Button>
      </div>
    );
  }, [handleSearch, handleValueChange, inputs]);

  const searchResults = useMemo(() => {

    if (isLoading) {
      return 'Searching...';
    }
    else if (!searchData?.results?.length) {
      return 'No matching results found';
    }

    const resultComponents = searchData.results.map((shelter) => {

      return (
        <div key={shelter.id}>
          <ShelterSearchResult
            availableAnimals={shelter.availableAnimals}
            avatarUrl={shelter.avatarUrl}
            canDelete={auth.isAdmin}
            id={shelter.id}
            name={shelter.name}
            onDelete={handleShowDeleteShelterDialog}
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
          <option value="availableAnimals">Available Pets</option>
          <option value="dateCreated">Newest First</option>
          <option value="name">Name First</option>
        </Form.Select>
        <div className="d-flex flex-wrap">
          {resultComponents}
        </div>
      </div>
    );
  }, [
    auth.isAdmin,
    handleShowDeleteShelterDialog,
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
        bodyText={`Really delete "${shelterToDelete?.name}"?`}
        onClose={handleCloseDeleteShelterDialog}
        onConfirm={handleConfirmDeleteShelter}
        show={Boolean(shelterToDelete)}
        title="Confirm Delete Shelter"
      />
    );
  }, [
    auth.isAdmin,
    handleCloseDeleteShelterDialog,
    handleConfirmDeleteShelter,
    shelterToDelete
  ]);


  const componentOutput = useMemo(() => {

    return (
      <Container fluid>
        <Row>
          <h1 className="display-4 mt-2">Browse Shelters</h1>
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

export default BrowseSheltersPage;
