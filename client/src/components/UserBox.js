import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import RegisterButton from './RegisterButton'
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

export default function UserBox(props){
    if(props.auth.isAuthenticated){
        return(
            <Nav className="user-box">
                <Nav.Item>
                    <Link className="nav-link" to="/">
                    <img className="notification-icon"src="/images/notifications.svg"></img>
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <LogoutButton updateAuthStatus ={props.auth.updateAuthStatus}/>
                </Nav.Item>
            </Nav>
        );
    } else {
        return(
            <Nav className="user-box">
                <Nav.Item>
                    <RegisterButton/>
                </Nav.Item>
                <Nav.Item>
                    <LoginButton/>
                </Nav.Item>
            </Nav>
        );
    }
}
