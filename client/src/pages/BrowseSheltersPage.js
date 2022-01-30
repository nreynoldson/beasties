import { useCallback, useEffect, useMemo, useState } from 'react';

import ShelterSearchResult from '../components/shelters/ShelterSearchResult';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import './css/Common.css';
import './css/BrowseSheltersPage.css';


const BrowseSheltersPage = (props) => {

  const getOriginalInputs = useMemo(() => {

    return {
      name: '',
      availableAnimals: 'any',
      sortOrder: 'availableAnimals'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState({ results: [] });

  const afterGetSearchResults = useCallback((response) => {

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
    setSearchData({ results: [
      {
        id: 1,
        name: 'Bob\'s Pets',
        avatarUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z',
        availableAnimals: 5
      },
      {
        id: 2,
        name: 'Critters',
        avatarUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z',
        availableAnimals: 23
      },
      {
        id: 3,
        name: 'Paw Pals',
        avatarUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z',
        availableAnimals: 130
      },
      {
        id: 4,
        name: 'Doug\'s Dogs',
        avatarUrl: null,
        dateCreated: '2022-01-23T18:44:20.051Z',
        availableAnimals: 250
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

  
  const searchControls = useMemo(() => {

    return (
      <div
        className={
          'fields p-5 d-flex flex-column ' +
          'justify-content-between align-items-right searchControls'
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

        <FloatingLabel controlId="floatingSelect" label="Minimum number of available pets">
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

    if (!searchData?.results?.length) {
      return 'No matching results found'
    }

    const resultComponents = searchData.results.map((shelter) => {

      return (
        <div key={shelter.id}>
          <ShelterSearchResult
            avatarUrl={shelter.avatarUrl}
            id={shelter.id}
            name={shelter.name}
            availableAnimals={shelter.availableAnimals}
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
  }, [handleValueChange, inputs, searchData]);

  const componentOutput = useMemo(() => {

    return (
      <div>
        <h1 className="display-4 mt-2">Browse Shelters</h1>
        <div className="d-flex">
          {searchControls}
          {searchResults}
        </div>
      </div>
    );
  }, [searchControls, searchResults]);

  return componentOutput;
}

export default BrowseSheltersPage;
