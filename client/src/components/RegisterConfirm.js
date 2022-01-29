import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "../components/Account";

export default class RegisterConfirm extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmationCode: "",
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
        console.log('in handle confirmation')
        e.preventDefault();

        try{
            var cognitoUser = this.props.user.cognitoUser;
            var username = this.props.user.username;
            var password = this.props.user.password;
            await cognitoUser.confirmRegistration(this.state.confirmationCode, true, async function(err, result) {
                if (err) {
                    alert(err.message || JSON.stringify(err));
                    return;
                }
                console.log('call result: ' + result);
                try{
                    await authenticate(username, password)
                }
                catch(err){
                    console.log(err.message)
                }
            
            });
            console.log('success!')
            this.props.updateStatus("finish");

        }
        catch(err){
            alert(err.message);

        }
    }

    render(){
        return(
            <Form>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control autoFocus type="tel"  name="confirmationCode" value={this.state.confirmationCode} onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="button" onClick={this.handleConfirmation}>
                    Submit
                </Button>
            </Form>
        );
    }
}