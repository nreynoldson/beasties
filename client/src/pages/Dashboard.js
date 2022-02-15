import Button from 'react-bootstrap/Button';

import './css/Common.css';
import './css/Dashboard.css';
import {ListGroup, Col, Container, Spinner} from 'react-bootstrap';
import UserDash from '../components/UserDash';
import ShelterDash from '../components/ShelterDash';
import {useState, useEffect} from 'react';

<<<<<<< Updated upstream
const LandingPage = (props) => {
=======
const Dashboard = (props) => {
  const [loading, setLoading] = useState('true');
>>>>>>> Stashed changes

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
      console.log(props)
  return (
    <div>
      <h1 className="display-1 titleText"><b>HI, {props.auth.currentUser.userName}</b></h1>
      {props.auth.currentUser.isShelterOwner ? <ShelterDash/> : <UserDash/>}
    </div>

  );
    }
}
 
export default LandingPage;