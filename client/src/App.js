import React, {Component} from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

class App extends Component {
  render(){
    return (
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path = "*" element={<NotFound />}></Route>
        </Routes>
      </div>
    );
  }
}

export default App;

