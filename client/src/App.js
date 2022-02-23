import React, {useState, useEffect} from 'react';
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
import ShelterProfile from './pages/ShelterProfile'
import {getUser, RequireAuth} from './components/account/Account.js';
import UserBox from './components/account/UserBox';
import Dashboard from './pages/Dashboard';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './App.css';


export default function App(){
  const [isAuthenticated, updateAuthStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserInfo() {
      var user = await getUser();
      console.log(user);
      if(user){
        updateAuthStatus(true);
        setUser(user);
      }
      setLoading(false);
    }
    getUserInfo();
  }, []);

  const isAdmin = true;

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
    isAuthenticated: isAuthenticated,
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
        <Route path="/about" element={<HowItWorksPage />}></Route>
        <Route path="/admin" element={<AdminLandingPage />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage />}></Route>
        <Route path="/browse-users" element={<BrowseUsersPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/pet/new" element={<PetModifyProfilePage />}></Route>
        <Route path="/pet/:petId/edit" element={<PetModifyProfilePage />}></Route>
        <Route exact path="/pet/:petName/:shelterName" element={<PetProfile auth={auth} />}></Route>
        <Route exact path="/shelter/:shelterId" element={<ShelterProfile auth={auth} />}></Route>
        <Route exact path="/" element={isAuthenticated ? <Dashboard auth={auth}/> : <LandingPage loading={loading} />}></Route>
        <Route exact path="/login" element={<Login auth={auth}/>}></Route>
        <Route exact path="/register" element={<Register auth={auth}/>}></Route>
        <Route exact path="/reset-password" element={<ForgotPassword auth={auth}/>}></Route>
        <Route exact path="/notifications" element={<RequireAuth auth={auth}><NotificationCenter auth={auth}/></RequireAuth>}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  
  );
};
