import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';

class App extends Component {
  render(){
    return (
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />}>
          </Route>
        </Routes>
      </div>
    );
  }
}

export default App;

