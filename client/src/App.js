import React, { useState, useEffect, useCallback } from 'react';
import {
  NavLink,
  Route,
  Routes
} from 'react-router-dom';
import { usePromiseTracker } from "react-promise-tracker";
import 'bootstrap/dist/css/bootstrap.min.css';

import AdminLandingPage from './pages/AdminLandingPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import BrowseSheltersPage from './pages/BrowseSheltersPage';
import BrowseUsersPage from './pages/BrowseUsersPage';
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
import ShelterProfile from './pages/ShelterProfile'
import {RequireAuth} from './components/account/Account.js';
import UserBox from './components/account/UserBox';
import Dashboard from './pages/Dashboard';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Spinner} from 'react-bootstrap';

import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings, MdPets } from "react-icons/md";
import { RiHomeHeartFill } from "react-icons/ri";

import './App.css';
import api from './api/api';

export default function App() {

  // Temporarily setting isAdmin to true for development
  const [isAdmin, setIsAdmin] = useState(true);
  const [isAuthenticated, updateAuthStatus] = useState(null);
  const [isShelterOwner, setIsShelterOwner] = useState(false);
  const [user, setUser] = useState(null);

  const { promiseInProgress : isLoading } = usePromiseTracker();

  const processUser = useCallback((response) => {
    if (response.error) {
      // Handle error
      updateAuthStatus(false);
      return;
    }
    else {
      var user = response.result;
      if (user) {
        updateAuthStatus(true);
        setUser(user);
        setIsAdmin(user.isAdmin);
        setIsShelterOwner(user.isShelterOwner);
      }
      else
        updateAuthStatus(false);
    }
  }, []);

  useEffect(() => {
    api.User.getInfo().then(processUser);
  }, [processUser, isAuthenticated]);

  const auth = {
    isAdmin,
    isAuthenticated: isAuthenticated,
    isShelterOwner,
    updateAuthStatus: updateAuthStatus,
    currentUser: user
  }

  const loadingIndicator =    
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  var showIndicator = isAuthenticated === null || (isAuthenticated && !user);

  return (
    <div className="App">
      <Navbar className="me-auto" variant="dark" collapseOnSelect expand="lg">
        <Nav>
          <Navbar.Brand>
            <NavLink className="nav-link" to="/">
              <div className="d-flex align-items-center site-branding">
                
                <img
                  alt="Beasties Logo"
                  src="/images/paw_heart.png"
                  className="d-inline-block align-top mr-3 site-branding-image"
                  height="50"
                />
                Beasties
              </div>
            </NavLink>
          </Navbar.Brand>
        </Nav>
        <Navbar.Toggle/>
        <Navbar.Collapse id="site-navbar">
          <Nav className="ml-auto navLinks">
            <Nav.Item>
              <NavLink className="nav-link" to="/browse-pets">
                <MdPets className="nav-bar-icon" />
                Pets
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink className="nav-link" to="/browse-shelters">
                <RiHomeHeartFill className="nav-bar-icon" />
                Shelters
              </NavLink>
            </Nav.Item>
            <Nav.Item>
            </Nav.Item>
            <Nav.Item>
              <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
            </Nav.Item>
          </Nav>
          {isLoading ? 
              <Spinner className="small" size="sm" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>  : <UserBox auth={auth}/>}
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/about" element={<HowItWorksPage auth={auth} />}></Route>
        <Route path="/admin" element={<AdminLandingPage auth={auth} />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage auth={auth} />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage auth={auth} />}></Route>
        <Route path="/browse-users" element={<BrowseUsersPage auth={auth} />}></Route>
        <Route path="/contact" element={<ContactPage auth={auth} />}></Route>
        <Route path="/pet/new" element={<PetModifyProfilePage auth={auth} />}></Route>
        <Route path="/pet/:petName/:shelterName/edit" element={<PetModifyProfilePage auth={auth} />}></Route>
        <Route exact path="/pet/:petName/:shelterName" element={<PetProfile auth={auth} />}></Route>
        <Route exact path="/shelter/:shelterName" element={<ShelterProfile auth={auth} />}></Route>
        <Route exact path="/" element={showIndicator ? loadingIndicator : (isAuthenticated ? <Dashboard auth = {auth}/> : <LandingPage auth={auth}/>)}></Route>
        <Route exact path="/login" element={<Login auth={auth}/>}></Route>
        <Route exact path="/register" element={<Register auth={auth}/>}></Route>
        <Route exact path="/reset-password" element={<ForgotPassword auth={auth}/>}></Route>
        <Route exact path="/notifications" element={<RequireAuth auth={auth}><NotificationCenter auth={auth}/></RequireAuth>}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  
  );
};
