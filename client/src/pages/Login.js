import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {authenticate} from "../components/Account";
import {Link} from 'react-router-dom';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            error: ""
        }
        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    async onSubmit (e) {
        console.log('in on submit')
        this.setState({loading: true})
        try{
            await authenticate(this.state.email, this.state.password)
            this.props.hasAuthenticated(true);
        }
        catch(err){
            alert(err.message);
            this.setState({loading: false})
        }
    }
    render() {
        return (
    
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" onChange = {this.inputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" name="password" onChange = {this.inputChange} />
                </Form.Group>
                <Link to="/forgot-password">Forgot your password?</Link>
                <Button variant="primary" type="button" onClick = {this.onSubmit}>
                    Login
                </Button>
            </Form>
        );
    }
}