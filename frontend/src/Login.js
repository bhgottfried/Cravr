import './App.css';
import './Home.css';
import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";

export function attemptLogin(email, password) {
  var path = "/Login";
  return fetch("/cravr/login", {
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
    if (path === "/Login") {
      alert("Invalid username or password.");
    }
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
    attemptLogin(email, password).then(function(res){
      if (res === "/") {
        var CryptoJS = require("crypto-js");
        cookies.set('Username', email, { path: '/' });
        cookies.set('Password', CryptoJS.AES.encrypt(password, 'CravrisCool').toString(), { path: '/' });
        console.log(cookies.get('Password'));
      }
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
        <h1 className="test2">
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
              className="text-box"
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password" >
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-box"
            />
          </Form.Group>
          <br></br>
          <div name="login" className="login">
            <button className="primary-button"> Login </button>
          </div>
        </Form>
      </div>
      <br></br>
      <i>New to Cravr? Sign up!</i>
      <div name="register" className="register">
        <button className="secondary-button" onClick={() => routeChange("/Register")}> Register </button>
      </div>
    </div>
  );
}

export default Login;
