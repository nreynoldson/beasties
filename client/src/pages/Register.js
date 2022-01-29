import React, { Component } from 'react';
import RegisterForm from '../components/RegisterForm';
import FinishRegistration from '../components/FinishRegistration';
import RegisterConfirm from '../components/RegisterConfirm';
import LogoutButton from '../components/LogoutButton';
import '../style/Register.css'


export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            status: 'signup'
        }

        this.updateStatus = this.updateStatus.bind(this);
        this.saveCredentials = this.saveCredentials.bind(this);

    }

    updateStatus(status){
        if(status === 'finish'){
            this.props.props.hasAuthenticated(true);
        }
        this.setState({status: status})
    }
    saveCredentials(username, password, user){
        var cognitoUser = {username: username, password: password, cognitoUser: user}
        this.setState({user: cognitoUser, status: "confirm"})
    }

    render() {
        console.log(this.props)
        if(this.props.props.authenticated && this.state.status !== 'finish'){
            return(
            <LogoutButton hasAuthenticated ={this.props.props.hasAuthenticated}></LogoutButton>);
         } else if(this.state.status === 'signup') {
            return (<RegisterForm saveCredentials = {this.saveCredentials}></RegisterForm>);
        } else if(this.state.status === 'confirm') {
            return(
                <RegisterConfirm user={this.state.user} updateStatus={this.updateStatus}></RegisterConfirm>
            );
        } else {
            return(
                <FinishRegistration updateStatus={this.updateStatus}></FinishRegistration>
            );
        }
    }
}