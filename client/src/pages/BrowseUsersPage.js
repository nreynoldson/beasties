import { useCallback, useEffect, useMemo, useState } from 'react';

import api from '../api/api';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import NotFound from './NotFound';
import UserSearchResult from '../components/users/UserSearchResult';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

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
      isShelterOwner: 'false',
      sortOrder: 'name'
    };
  }, []);

  const [inputs, setInputs] = useState(getOriginalInputs);
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  const filterAndSortResults = useCallback((newSearchData) => {

    newSearchData = newSearchData.filter((user) => {

      if (inputs.name?.length && !user.userName.toLowerCase().includes(inputs.name.toLowerCase())) {
        return false;
      }

      if (inputs.email?.length && !user.email.toLowerCase().includes(inputs.email.toLowerCase())) {
        return false;
      }

      return true;
    });

    if (inputs.sortOrder === 'name') {
      newSearchData.sort(
        (a, b) => a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
      );
    }

    else if (inputs.sortOrder === 'email') {
      newSearchData.sort(
        (a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase())
      );
    }

    return newSearchData;
  }, [inputs]);

  const afterGetSearchResults = useCallback((response) => {

    setIsLoading(false);
    const { error, result } = response;
    if (error) {
      // Handle error
      return;
    }

    else {
      const newSearchData = filterAndSortResults(result);
      setSearchData(newSearchData);
    }

  }, [filterAndSortResults]);

  const handleSearch = useCallback(() => {

    setIsLoading(true);
    const userType = (inputs.isShelterOwner === 'true') ? 'shelterUsers' : 'regularUsers'
    api.User.search(userType).then(afterGetSearchResults);
  }, [afterGetSearchResults, inputs]);

  useEffect(() => {

    // Run a search whenever the component loads or inputs.sortOrder changes
    if (auth.isAdmin) {
      handleSearch();
    }

  }, [auth.isAdmin, inputs.sortOrder]);

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
  
    api.User.delete(userToDelete.id).then(handleSearch);
    handleCloseDeleteUserDialog();
  }, [handleCloseDeleteUserDialog, handleSearch, userToDelete]);

  
  const searchControls = useMemo(() => {

    return (
      <div
        className={
          'fields p-5 d-flex flex-column justify-content-between ' +
          'align-items-right userSearchControls'
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
            <option value="true">Yes</option>
            <option value="false">No</option>
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
    else if (!searchData?.length) {
      return 'No matching results found';
    }

    const resultComponents = searchData.map((user, index) => {

      return (
        <div key={index}>
          <UserSearchResult
            avatarUrl={user.avatarUrl}
            canDelete={user.userName !== auth.currentUser?.userName}
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
          <option value="dateCreated">Newest First</option>
        </Form.Select>
        <div className="d-flex flex-wrap">
          {resultComponents}
        </div>
      </div>
    );
  }, [
    auth,
    handleShowDeleteUserDialog,
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
        bodyText={`Really delete "${userToDelete?.name}"?`}
        onClose={handleCloseDeleteUserDialog}
        onConfirm={handleConfirmDeleteUser}
        show={Boolean(userToDelete)}
        title="Confirm Delete User"
      />
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
      <Container fluid>
        <Row>
          <h1 className="display-4 mt-2">Browse Users</h1>
        </Row>
        <Row>
          <Col md="auto">{searchControls}</Col>
          <Col>{searchResults}</Col>
        </Row>
        {confirmDeleteModal}
      </Container>
    );
  }, [
    auth,
    confirmDeleteModal,
    searchControls,
    searchResults
  ]);

  return componentOutput;
}

export default BrowseUsersPage;
