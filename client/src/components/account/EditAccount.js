import {Container} from 'react-bootstrap';
import {useState} from 'react';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import {ArrowLeftShort} from 'react-bootstrap-icons';
const EditAccount = (props) => {
    const [loading, setLoading] = useState('true');
    const [view, setView] = useState('overview');
  
    if(view == 'changePass'){
        return (
            <Container className='edit-account'>
                <div className="back-wrapper">
                    <ArrowLeftShort size={30} onClick={() => {setView('overview')}}/>
                </div>
                <ChangePassword auth={props.auth}></ChangePassword>
            </Container>
        );
    } else {
        return (
            <Container className='edit-account'>
                <h1>Edit Profile</h1>
                <EditProfile setView={setView} auth={props.auth}></EditProfile>
            </Container>
        );

    }
}
 
export default EditAccount;