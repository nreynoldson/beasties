import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import BrowsePetsPage from './pages/BrowsePetsPage';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default App = () => {

  return (
    <Router>
      <div>
        <Navbar variant="light" bg="primary">
          <Nav>
            <Nav.Brand>
              <Nav.Link to="/">Beasties</Nav.Link>
            </Nav.Brand>
            <Nav.Item>
              <Nav.Link to="/about">How It Works</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to="/browse-pets">How It Works</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to="/contact">Contact Us</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

        <Switch>
          <Route path="/about">
            <HowItWorksPage />
          </Route>
          <Route path="/browse-pets">
            <BrowsePetsPage />
          </Route>
          <Route path="/contact">
            <ContactPage />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}