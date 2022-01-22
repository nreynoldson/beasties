import React, {Component} from 'react';
import {
  Link,
  Route,
  Routes
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import BrowsePetsPage from './pages/BrowsePetsPage';
import BrowseSheltersPage from './pages/BrowseSheltersPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import PetModifyProfilePage from './pages/PetModifyProfilePage';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';

export default function App() {
  return (

    <div className="App">
      <Navbar className="me-auto" variant="dark" bg="primary">
        <Nav>
          <Navbar.Brand>
            <Link className="nav-link" to="/">
              <h1 className="d-flex align-items-center">
                <img
                  alt="Beasties Logo"
                  src="/images/paw_heart.png"
                  className="d-inline-block align-top mr-3 mt-2"
                  width="40"
                  height="40"
                />
                Beasties
              </h1>
            </Link>
          </Navbar.Brand>
        </Nav>
        <Nav className="ml-auto navLinks">
          <Nav.Item>
            <Link className="nav-link" to="/about">How It Works</Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/browse-pets">Pets</Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/browse-shelters">Shelters</Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/contact">Contact Us</Link>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/about" element={<HowItWorksPage />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/pets/:petId/edit" element={<PetModifyProfilePage />}></Route>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

