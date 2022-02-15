import {Button, Container, Tab} from 'react-bootstrap';
import NotificationCenter from '../pages/NotificationCenter';
import {useState, useEffect} from 'react';
import PetModifyProfilePage from '../pages/PetModifyProfilePage';

const ManagePets = (props) => {
    const [loading, setLoading] = useState('true');
    const [view, setView] = useState('overview');

    useEffect(() => {
      //TODO: Get the shelter's pets
    }, []);
  

    switch(view){
        case 'overview':
            return (
                <Container className='manage-pets'>
                    <Button onClick={() => {setView('new')}}>Add a New Pet</Button>
                </Container>
              );
        case 'new':
            return (
                <PetModifyProfilePage/>
            )
        case 'edit':
            return (
                <PetModifyProfilePage/>
            )

    }
}
 
export default ManagePets;
