import Pool from "../UserPool";
import { useNavigate } from 'react-router-dom';
import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default function LogoutButton(props) {
    const navigate = useNavigate();
  
    return <Logout {...props} navigate={navigate} />;
  }

class Logout extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
        const user = Pool.getCurrentUser();
            if(user){
                user.signOut();
            }
        this.props.hasAuthenticated(false);
        this.props.navigate('/login');
    }

    render(){
        return(
            <Button onClick={this.handleLogout}>Logout</Button>
        );
    }
}