import './App.css';
import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

export function attemptLogin(email, password) {
  var path = "/";
  return fetch("/login", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "content_type": "application/json"
    },
    // TODO Send login credentials over SSL
    body: JSON.stringify(email + "\n" + password)
  }).then(response => response.json())
  .then(response => {
    path = response.result;
    return response.result;
  }).catch((error) => {
    console.error(error);
    return path;
  });
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();  

  const history = useHistory();
  const routeChange = path => { 
    history.push(path);
  }

  function handleSubmit(event) {
		event.preventDefault();
   
    var CryptoJS = require("crypto-js");
    cookies.set('Username', email, { path: '/' });
    cookies.set('Password', CryptoJS.AES.encrypt(password, 'CravrisCool').toString(), { path: '/' });
    console.log(cookies.get('Password'));
    
    attemptLogin(email, password).then(function(res){
      routeChange(res);
    });
  }

  return (
    <div className="App">
      {cookies.remove('Username', { path: '/' })}
      {cookies.remove('Password', { path: '/' })}
      <nav className="bar">
        <span>Cravr</span>
      </nav>
      <body className="App-body">
        <h1>
          Welcome to Cravr!
        </h1>
        <h2>
          Sign In
        </h2>
      </body>
      <div className="login-form">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>&emsp; Email: </Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <br></br>
          <div name="login" className="login">
            <button renderas="button" className="primary-button">
              <span>Login</span>
            </button>
          </div>
        </Form>
      </div>
      <br></br>
      <i>New to Cravr? Sign up!</i>
      <div name="register" className="register">
        <button renderas="button" className="secondary-button" onClick={() => routeChange("/Register")}>
          <span>Register</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
