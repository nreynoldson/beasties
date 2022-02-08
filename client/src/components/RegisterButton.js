import { useNavigate } from 'react-router-dom';
import React from 'react';
import {Button} from 'react-bootstrap';

export default function RegisterButton(){
    const navigate = useNavigate();

    const handleClick = () => {
       navigate('/register');
    }

    return(
        <Button className="pink-btn nav-btn" onClick={handleClick}>Sign Up</Button>
    );
}