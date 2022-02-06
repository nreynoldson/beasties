
import React, {useState, useEffect} from 'react';
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
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'
import NotificationCenter from './pages/NotificationCenter'
import PetProfile from './pages/PetProfile'
import {getUser} from './components/Account.js';
import UserBox from './components/UserBox.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './App.css';

export default function App(){
    const [isAuthenticated, updateAuthStatus] = useState(false);
    const [user, setUser] = useState(null);

  useEffect(async () => {
    var user = await getUser();
    if(user){
      updateAuthStatus(true);
      setUser(user);
    }
  }, []);

  const auth = {
    isAuthenticated: isAuthenticated,
    updateAuthStatus: updateAuthStatus
  }

    
  return (
    <div className="App">
      <Navbar className="me-auto" variant="dark">
        <Nav>
          <Navbar.Brand>
            <Link className="nav-link" to="/">
              <div className="d-flex align-items-center">
                <img
                  alt="Beasties Logo"
                  src="/images/paw_heart.png"
                  className="d-inline-block align-top mr-3"
                  height="50"
                />
                Beasties
              </div>
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
        <UserBox auth={auth}/>
      </Navbar>
      <Routes>
        <Route path="/about" element={<HowItWorksPage />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/pet/new" element={<PetModifyProfilePage />}></Route>
        <Route path="/pet/:petId/edit" element={<PetModifyProfilePage />}></Route>
        <Route exact path="/pets/:petId" element={<PetProfile auth={auth} />}></Route>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route exact path="/login" element={<Login auth={auth}/>}></Route>
        <Route exact path="/register" element={<Register auth={auth}/>}></Route>
        <Route exact path="/reset-password" element={<ForgotPassword auth={auth}/>}></Route>
        <Route exact path="/notifications" element={<NotificationCenter auth={auth}/>}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  
  );
};
