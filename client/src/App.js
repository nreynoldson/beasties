import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import BrowsePetsPage from './pages/BrowsePetsPage';
import BrowseSheltersPage from './pages/BrowseSheltersPage';
import ContactPage from './pages/ContactPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class App extends Component {
  render(){
    return (
      <div className="App">
        <Navbar className="me-auto" variant="dark" bg="primary">
          <Nav>
            <Navbar.Brand>
              <Nav.Link href="/">Beasties</Nav.Link>
            </Navbar.Brand>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link href="/about">How It Works</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/browse-pets">Pets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/browse-shelters">Shelters</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/contact">Contact Us</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

        <Routes>
          <Route path="/about" element={<HowItWorksPage />}></Route>
          <Route path="/browse-pets" element={<BrowsePetsPage />}></Route>
          <Route path="/browse-shelters" element={<BrowseSheltersPage />}></Route>
          <Route path="/contact" element={<ContactPage />}></Route>
          <Route exact path="/" element={<LandingPage />}></Route>
          <Route path = "*" element={<NotFound />}></Route>
        </Routes>
      </div>
    );
  }
}

export default App;

