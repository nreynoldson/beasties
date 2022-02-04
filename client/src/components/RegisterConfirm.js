import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "../components/Account";

export default class RegisterConfirm extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmationCode: "",
            error: ""
        }
        this.handleConfirmation = this.handleConfirmation.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    async handleConfirmation(e){
        e.preventDefault();

        try{
            var cognitoUser = this.props.user.cognitoUser;
            var username = this.props.user.username;
            var password = this.props.user.password;
            await cognitoUser.confirmRegistration(this.state.confirmationCode, true, async (err, result) =>
            {
                if (err) {
                    this.setState({error: err.message});
                    return;
                } else {
                    try{
                        await authenticate(username, password);
                        this.props.updateStatus("finish");
                    }
                    catch(err){
                        if(this.state.error === "")
                            this.setState({error: err.message});
                    }
                }
            });
        }
        catch(err){
            if(this.state.error === "")
                this.setState({error: err.message});
        }
    }

    render(){
        return(
            <Form className="register">
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control autoFocus type="tel"  
                        name="confirmationCode" 
                        value={this.state.confirmationCode} 
                        onChange={this.handleChange}
                        isInvalid ={this.state.error !== ''} />
                    <Form.Control.Feedback type='invalid'>
                        {this.state.error}
                    </Form.Control.Feedback>
                </Form.Group>
            
                <Button variant="primary" className="pink-btn" type="button" onClick={this.handleConfirmation}>
                    Submit
                </Button>
            </Form>
        );
    }
}