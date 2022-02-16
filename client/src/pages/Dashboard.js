import Button from 'react-bootstrap/Button';

import './css/Common.css';
import './css/Dashboard.css';
import {ListGroup, Col, Container, Spinner} from 'react-bootstrap';
import UserDash from '../components/users/UserDash';
import ShelterDash from '../components/shelters/ShelterDash';
import {useState, useEffect} from 'react';

const Dashboard = (props) => {
  const [loading, setLoading] = useState('true');

  useEffect(() => {
    setLoading(!props.auth.currentUser)
  }, [props]);


  if(loading){
    return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
    } else {
  return (
    <div>
      <h1 className="display-1 titleText"><b>HI, {props.auth.currentUser.userName}</b></h1>
      {props.auth.currentUser.isShelterOwner ? <ShelterDash/> : <UserDash/>}
    </div>

  );
    }
}
 
export default Dashboard;