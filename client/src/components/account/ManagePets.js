import {Button, Container, Tab} from 'react-bootstrap';
import NotificationCenter from '../../pages/NotificationCenter';
import {useState, useEffect} from 'react';
import PetModifyProfilePage from '../../pages/PetModifyProfilePage';
import ShelterPets from '../shelters/ShelterPets';

const ManagePets = (props) => {
    const [loading, setLoading] = useState('true');
    const [view, setView] = useState('overview');
    console.log(props);
  
    switch(view){
        case 'overview':
            return (
                <Container className='manage-pets'>
                    <Button onClick={() => {setView('new')}}>Add a New Pet</Button>
                    <ShelterPets></ShelterPets>
                </Container>
              );
        case 'new':
            return (
                <PetModifyProfilePage auth={props.auth}/>
            )
        case 'edit':
            return (
                <PetModifyProfilePage auth={props.auth}/>
            )

    }
}
 
export default ManagePets;
