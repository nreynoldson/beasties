import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function FinishRegistration(props) {
    const navigate = useNavigate();
  
    return <RegistrationForm {...props} navigate={navigate} />;
  }

class RegistrationForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            dob: "",
            location: "",
            isShelter: "",
            shelterName: "",
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    onSubmit(){
        //store data to db
        this.props.updateStatus("complete")
        this.props.navigate('/');
    }

    inputChange(e){
        var name = e.target.name;
        var value = e.target.value;
        this.setState({[name]: value});
    }

    render(){
        return(
            <div className="register">
                <h2>Almost there! Finish setting up your account:</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={this.state.name} 
                                onChange= {this.inputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="dob" 
                                value={this.state.dob} 
                                onChange= {this.inputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="location" 
                                value={this.state.location} 
                                onChange= {this.inputChange}
                                />
                        </Form.Group>

                        <Form.Check 
                            type="switch"
                            id="custom-switch"
                            label="I am a shelter owner/worker"
                            onChange = {(e) => {this.setState({isShelter: e.target.checked})}}
                        />

                        {this.state.isShelter ? 
                            <><Form.Group className="mb-3">
                                <Form.Label>Shelter Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="shelterName" 
                                    value={this.state.shelterName} 
                                    onChange= {this.inputChange}
                                />
                            </Form.Group>
                             </> : ""}
                            <Button variant="primary" className="pink-btn" type="button" onClick={this.onSubmit}>
                                Submit
                            </Button>
                    </Form>
                </div>
        );
    }
}