import {Button, Container, Tab} from 'react-bootstrap';
import NotificationCenter from '../../pages/NotificationCenter';
import {useState, useEffect} from 'react';
import PetModifyProfilePage from '../../pages/PetModifyProfilePage';
import ShelterPets from '../shelters/ShelterPets';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

const EditAccount = (props) => {
    const [loading, setLoading] = useState('true');
    const [view, setView] = useState('overview');
  
    if(view == 'changePass'){
        return (
            <ChangePassword></ChangePassword>
        );
    } else {
        return (
            <Container className='edit-account'>
                <h1>Edit Profile</h1>
                <EditProfile setView={setView}></EditProfile>
                
            </Container>
        );

    }
}
 
export default EditAccount;