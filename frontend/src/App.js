

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
import Register from './Register';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/Login" component={Login} />
            <Route exact path="/" component={Home} />
            <Route exact path="/Review" component={Review} />
            <Route exact path="/Preferences" component={Prefr} />
            <Route exact path="/Register" component={Register} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
