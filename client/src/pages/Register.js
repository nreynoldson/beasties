import React, { Component } from 'react';
import {Form, Tab, Tabs} from 'react-bootstrap';
import AdopteeRegister from '../components/AdopteeRegister';
import ShelterRegister from '../components/ShelterRegister';
import '../style/Register.css';

export default class Register extends Component {
    render() {
        return (
            <div className="tab-container">
                <Tabs defaultActiveKey="Adoptee" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="Adoptee" title="Adoptee">
                        <AdopteeRegister></AdopteeRegister>
                    </Tab>
                    <Tab eventKey="Shelter" title="Shelter">
                        <ShelterRegister></ShelterRegister>
                    </Tab>
                </Tabs>  
            </div> 
        );
    }
}