import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import {Account, AccountContext} from './components/Account.js';

class App extends Component {
  render(){
    return (
      <Account>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/register" element={<Register />}></Route>
            <Route path = "*" element={<NotFound />}></Route>
          
          </Routes>
        </div>
      </Account>
    );
  }
}

export default App;

