import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import {AccountContext} from "../components/Account";

export default class Login extends Component {
    static contextType = AccountContext;
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
            loggedIn: false,
            error: ""
        }
        this.inputChange = this.inputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        this.context.getSession().then((session) => {
            console.log("Session: ", session);
            this.setState({loggedIn: true});
          });
    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    onSubmit(e){
        console.log('in on submit')
        this.context.authenticate(this.state.email, this.state.password)
            .then(data => {
                console.log('Logged in!');
            })
            .catch(err => {
                console.err(err);
                console.log(err.name)
                console.log(err.message)
            });
    }
    render() {
        const {authenticate, getSession, authed} =this.context;
        console.log(this.context.authed);
        return (
            
            <div>
                {this.state.loggedIn ? "Logged in!": "not logged in :("}
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" onChange = {this.inputChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" name="password" onChange = {this.inputChange} />
                </Form.Group>
                <Button variant="primary" type="button" onClick = {this.onSubmit}>
                    Login
                </Button>
            </Form>
            </div>
        );
    }
}