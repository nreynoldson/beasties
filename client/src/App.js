import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ForgotPassword from './components/ForgotPassword'
import {getUser} from './components/Account.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
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

  handleLogout(){

  }

  render(){
    const authProps = {
      authenticated: this.state.authenticated,
      hasAuthenticated: this.hasAuthenticated
    }
    return (
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home/>}></Route>
           
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/register" element={<Register props={authProps}/>}></Route>
            <Route exact path="/reset-password" element={<ForgotPassword props={authProps}/>}></Route>
            <Route path = "*" element={<NotFound />}></Route>
          
          </Routes>
        </div>
    );
  }
}

export default App;

