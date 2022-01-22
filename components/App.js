import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default App = () => {

  return (
    <Router>
      <div>

        <Switch>
          <Route path="/about">
            <HowItWorksPage />
          </Route>
          <Route path="/browse-pets">
            <BrowsePetsPage />
          </Route>
          <Route path="/browse-shelters">
            <BrowseSheltersPage />
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