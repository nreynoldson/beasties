import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import NotFound from './NotFound';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { FaUsers } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { RiHomeHeartFill } from "react-icons/ri";

import './css/AdminLandingPage.css';

const AdminLandingPage = (props) => {

  const navigate = useNavigate();

  const {
    auth
  } = props;


  const goToPage = useCallback((evt) => {

    const { route } = evt.currentTarget.dataset;
    navigate(route);
  }, [navigate]);

  const buttons = useMemo(() => {

    const buttonData = [
      {
        icon: MdPets,
        name: 'Manage Pets',
        route: '/browse-pets'
      },
      {
        icon: RiHomeHeartFill,
        name: 'Manage Shelters',
        route: '/browse-shelters'
      },
      {
        icon: FaUsers,
        name: 'Manage Users',
        route: '/browse-users'
      },
    ];

    return buttonData.map((data) => (

      <Button
        className="mt-3"
        key={data.route}
        data-route={data.route}
        onClick={goToPage}
        size="lg"
        variant="secondary"
      >
          <data.icon className="mb-1 mr-2"/>
          {data.name}
      </Button>
    ));
  }, [goToPage]);

  const componentOutput = useMemo(() => {
    
    if (!auth.isAdmin) {
      return <NotFound />;
    }

    return (
      <div className="d-flex flex-column">
        <h1 className="display-3 mb-4">Admin Options</h1>
        <Container className="d-flex flex-column buttonContainer">
          {buttons}
        </Container>
      </div>
    );
  }, [auth, buttons]);

  return componentOutput;
}
 
export default AdminLandingPage;