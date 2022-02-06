import Pool from "../UserPool";
import React from 'react';
import {Button} from 'react-bootstrap';

export default function LogoutButton(props){

    const handleLogout = () => {
        const user = Pool.getCurrentUser();
            if(user){
                user.signOut();
            }
        props.updateAuthStatus(false);
    }

    return(
        <Button className="pink-btn nav-btn" onClick={handleLogout}>Logout</Button>
    );
}