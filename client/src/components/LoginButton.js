import { useNavigate } from 'react-router-dom';
import React from 'react';
import {Button} from 'react-bootstrap';

export default function LoginButton(){
    const navigate = useNavigate();

    const handleClick = () => {
       navigate('/login');
    }

    return(
        <Button className="pink-btn nav-btn" onClick={handleClick}>Login</Button>
    );
}