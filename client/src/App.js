import React, { useState, useEffect } from 'react';
import {
  NavLink,
  Route,
  Routes
} from 'react-router-dom';
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
import { getUser } from './components/Account.js';
import UserBox from './components/UserBox.js';
import ShelterProfile from './pages/ShelterProfile'
import {getUser, RequireAuth} from './components/Account.js';
import UserBox from './components/UserBox';
import Dashboard from './pages/Dashboard';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './App.css';


export default function App() {

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, updateAuthStatus] = useState(false);
  const [isShelterOwner, setIsShelterOwner] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {

    getUser().then((user) => {

      if (user) {
        updateAuthStatus(true);
        setUser(user);

        const adminInfo = user.find((info) => info.name === 'is_admin');
        // Temporarily setting isAdmin to always be true for testing
        // setIsAdmin(adminInfo?.value || false);
        setIsAdmin(true);

        const shelterOwnerInfo = user.find((info) => info.name === 'is_shelter_owner');
        setIsShelterOwner(shelterOwnerInfo?.value || false);
      }
    });
  }, []);

  let adminPageLink = null;
  let userSearchLink = null;
  if (isAdmin) {
    adminPageLink = (
      <Nav.Item>
        <NavLink className="nav-link" to="/admin">Admin</NavLink>
      </Nav.Item>
    );

    userSearchLink = (
      <Nav.Item>
        <NavLink className="nav-link" to="/browse-users">Users</NavLink>
      </Nav.Item>
    );
  }

  const auth = {
    isAdmin,
    isAuthenticated: isAuthenticated,
    isShelterOwner,
    updateAuthStatus: updateAuthStatus,
    currentUser: user
  }

  return (
    <div className="App">
      <Navbar className="me-auto" variant="dark">
        <Nav>
          <Navbar.Brand>
            <NavLink className="nav-link" to="/">
              <div className="d-flex align-items-center">
                <img
                  alt="Beasties Logo"
                  src="/images/paw_heart.png"
                  className="d-inline-block align-top mr-3"
                  height="50"
                />
                Beasties
              </div>
            </NavLink>
          </Navbar.Brand>
        </Nav>
        <Nav className="ml-auto navLinks">
          <Nav.Item>
            <NavLink className="nav-link" to="/about" >
              How It Works
            </NavLink>
          </Nav.Item>
          {adminPageLink}
          {userSearchLink}
          <Nav.Item>
            <NavLink className="nav-link" to="/browse-pets">Pets</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink className="nav-link" to="/browse-shelters">Shelters</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
          </Nav.Item>
        </Nav>
        <UserBox auth={auth}/>
      </Navbar>
      <Routes>
        <Route path="/about" element={<HowItWorksPage auth={auth} />}></Route>
        <Route path="/admin" element={<AdminLandingPage auth={auth} />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage auth={auth} />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage auth={auth} />}></Route>
        <Route path="/browse-users" element={<BrowseUsersPage auth={auth} />}></Route>
        <Route path="/contact" element={<ContactPage auth={auth} />}></Route>
        <Route path="/pet/new" element={<PetModifyProfilePage auth={auth} />}></Route>
        <Route path="/pet/:petId/edit" element={<PetModifyProfilePage auth={auth} />}></Route>
        <Route exact path="/pet/:petId" element={<PetProfile auth={auth} />}></Route>
        <Route exact path="/shelter/:shelterId" element={<ShelterProfile auth={auth} />}></Route>
        <Route exact path="/" element={isAuthenticated ? <Dashboard auth={auth}/> : <LandingPage />}></Route>
        <Route exact path="/login" element={<Login auth={auth}/>}></Route>
        <Route exact path="/register" element={<Register auth={auth}/>}></Route>
        <Route exact path="/reset-password" element={<ForgotPassword auth={auth}/>}></Route>
        <Route exact path="/notifications" element={<RequireAuth auth={auth}><NotificationCenter auth={auth}/></RequireAuth>}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  
  );
};
