import { useCallback, useEffect, useMemo, useState } from 'react';

import NotFound from './NotFound';
import UserSearchResult from '../components/users/UserSearchResult';

import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'

import './css/Common.css';
import './css/BrowseUsersPage.css';


const BrowseUsersPage = (props) => {

  const {
    auth
  } = props;

  const getOriginalInputs = useMemo(() => {

    return {
      name: '',
      email: '',
      isShelterOwner: 'any',
      sortOrder: 'name'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState({ results: [] });
  const [userToDelete, setUserToDelete] = useState(null);

  const afterGetSearchResults = useCallback((response) => {

    if (response.error) {
      // Handle error
      return;
    }

    else {
      // Set inputs to pet values
      // setInputs();
      setIsLoading(false);
    }

  }, []);

  const handleSearch = useCallback(() => {

    // TODO: make this actually search when the back end api is ready
    setSearchData({ results: [
      {
        id: 1,
        name: 'Bob Petman',
        avatarUrl: null,
        email: 'test@test.com',
        dateCreated: '2022-01-23T18:44:20.051Z',
        isShelterOwner: true,
        shelterName: 'Bob\'s Pets'
      },
      {
        id: 2,
        name: 'Casey Smith',
        avatarUrl: null,
        email: 'test@test.com',
        dateCreated: '2022-01-23T18:44:20.051Z',
        isShelterOwner: true,
        shelterName: 'Bob\'s Pets'
      },
      {
        id: 3,
        name: 'Jackie Smith',
        avatarUrl: null,
        email: 'test@test.com',
        dateCreated: '2022-01-23T18:44:20.051Z',
        isShelterOwner: false,
        shelterName: null
      },
      {
        id: 4,
        name: 'Doug Dogman',
        avatarUrl: null,
        email: 'test@test.com',
        dateCreated: '2022-01-23T18:44:20.051Z',
        isShelterOwner: true,
        shelterName: 'Doug\'s Dogs'
      }
    ] });
  }, []);

  useEffect(() => {

    // Run a search whenever the component loads or inputs.sortOrder changes
    if (auth.isAdmin) {
      handleSearch();
    }

  }, [auth.isAdmin, handleSearch, inputs.sortOrder]);

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


  const handleCloseDeleteUserDialog = useCallback(() => setUserToDelete(null), []);

  const handleShowDeleteUserDialog = useCallback((id, name) => setUserToDelete({ id, name }), []);

  const handleConfirmDeleteUser = useCallback(() => {
  
    handleCloseDeleteUserDialog();
  }, [handleCloseDeleteUserDialog]);

  
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

        <FloatingLabel controlId="floatingInput" label="Email">
          <Form.Control
            type="text"
            value={inputs.email}
            onChange={handleValueChange}
            name="email"
          />
        </FloatingLabel>

        <FloatingLabel controlId="floatingSelect" label="Is a shelter owner">
          <Form.Select
            onChange={handleValueChange}
            name="isShelterOwner"
            defaultValue={inputs.isShelterOwner}
            size="sm"
          >
            <option value="any">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
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

    const resultComponents = searchData.results.map((user) => {

      return (
        <div key={user.id}>
          <UserSearchResult
            avatarUrl={user.avatarUrl}
            canDelete={true}
            id={user.id}
            isShelterOwner={user.isShelterOwner}
            shelterName={user.shelterName}
            email={user.email}
            name={user.name}
            onDelete={handleShowDeleteUserDialog}
            availableAnimals={user.availableAnimals}
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
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="isShelterOwner">Is a shelter owner</option>
          <option value="dateCreated">Newest First</option>
        </Form.Select>
        <div className="d-flex flex-wrap">
          {resultComponents}
        </div>
      </div>
    );
  }, [handleShowDeleteUserDialog, handleValueChange, inputs, searchData]);

  
  const confirmDeleteModal = useMemo(() => {

    if (!auth.isAdmin) {
      return null;
    }

    return (
      <Modal show={Boolean(userToDelete?.id)} onHide={handleCloseDeleteUserDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Really delete this users?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <h5 className="mt-3">Delete user "{userToDelete?.name}"?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteUserDialog}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }, [
    auth.isAdmin,
    handleCloseDeleteUserDialog,
    handleConfirmDeleteUser,
    userToDelete
  ]);

  const componentOutput = useMemo(() => {

    if (!auth.isAdmin) {
      return <NotFound />;
    }

    return (
      <div>
        <h1 className="display-4 mt-2">Browse Users</h1>
        <div className="d-flex">
          {searchControls}
          {searchResults}
        </div>
        {confirmDeleteModal}
      </div>
    );
  }, [auth, confirmDeleteModal, searchControls, searchResults]);

  return componentOutput;
}

export default BrowseUsersPage;
