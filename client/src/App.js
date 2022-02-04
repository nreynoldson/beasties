
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
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'
import NotificationCenter from './pages/NotificationCenter'
import LoginButton from './components/LoginButton'
import LogoutButton from './components/LogoutButton'
import RegisterButton from './components/RegisterButton'
import PetProfile from './pages/PetProfile'
import {getUser} from './components/Account.js';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import './App.css';
import { NavItem } from 'react-bootstrap';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      user: null,
      authenticated: false,
      authenticating: true
    }

    this.hasAuthenticated = this.hasAuthenticated.bind(this);
  }

  async componentDidMount(){
    var user = await getUser();
    console.log(user);

    if(user){
        this.setState({user: user, authenticated: true});
    }
    this.setState({authenticating: false});
  }

  hasAuthenticated(authenticated) {
    this.setState({authenticated: authenticated});
  }
  render(){
    const authProps = {
      authenticated: this.state.authenticated,
      hasAuthenticated: this.hasAuthenticated
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
        <Nav className="user-box">
        {this.state.authenticated ? (<><Nav.Item><Link className="nav-link" to="/notifications"><img className="notification-icon"src="/images/notifications.svg"></img></Link></Nav.Item><Nav.Item><LogoutButton hasAuthenticated ={this.hasAuthenticated}/></Nav.Item></>) : (<><Nav.Item><RegisterButton/></Nav.Item><Nav.Item><LoginButton/></Nav.Item></>)}
        </Nav>
      </Navbar>
      <Routes>
        <Route path="/about" element={<HowItWorksPage />}></Route>
        <Route path="/browse-pets" element={<BrowsePetsPage />}></Route>
        <Route path="/browse-shelters" element={<BrowseSheltersPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/pet/new" element={<PetModifyProfilePage />}></Route>
        <Route path="/pet/:petId/edit" element={<PetModifyProfilePage />}></Route>
        <Route exact path="/pet/profile" element={<PetProfile />}></Route>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route exact path="/login" element={<Login authProps={authProps}/>}></Route>
        <Route exact path="/register" element={<Register authProps={authProps}/>}></Route>
        <Route exact path="/reset-password" element={<ForgotPassword authProps={authProps}/>}></Route>
        <Route exact path="/notifications" element={<NotificationCenter authProps={authProps}/>}></Route>
        <Route path = "*" element={<NotFound />}></Route>
      </Routes>
    </div>
  
  );}
};
