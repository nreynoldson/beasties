import {Button, Container} from 'react-bootstrap';
import {useState} from 'react';
import PetModifyProfilePage from '../../pages/PetModifyProfilePage';
import ShelterPets from '../shelters/ShelterPets';
import {ArrowLeftShort} from 'react-bootstrap-icons';

const ManagePets = (props) => {
    const [loading, setLoading] = useState('true');
    const [view, setView] = useState('overview');
    const [petToEdit, setPetToEdit] = useState('overview');

    const onEdit = (petName) => {
        setPetToEdit(petName);
        setView('edit');
    }
    switch(view){
        case 'overview':
            return (
                <Container className='manage-pets'>
                    <Button onClick={() => {setView('new')}}>Add a New Pet</Button>
                    <ShelterPets shelterName={props.auth.currentUser.shelterName} auth={props.auth} onEdit={onEdit}/>
                </Container>
              );
        case 'new':
            return (
                <div>
                    <div className="back-wrapper">
                        <ArrowLeftShort size={30} onClick={() => {setView('overview')}}/>
                    </div>
                    <PetModifyProfilePage auth={props.auth} shelterName={props.auth.currentUser.shelterName}/>
                </div>
            )
        case 'edit':
            return (
                <div>
                    <div className="back-wrapper">
                        <ArrowLeftShort size={30} onClick={() => {setView('overview')}}/>
                    </div>
                    <PetModifyProfilePage auth={props.auth} petName={petToEdit} shelterName={props.auth.currentUser.shelterName}/>
                </div>
            )

    }
}
 
export default ManagePets;
