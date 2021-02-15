

//eslint-disable-next-line
import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom"
import Login from './Login';
import Home from './Home';
import Review from './Review';
import Prefr from './Preferences';
//import Contact from './components/Contact';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/Home" exact component={Home} />
            <Route exact path="/Review" exact component={Review} />
            <Route exact path="/Preferences" exact component={Prefr} />
            <Route component={Login} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
