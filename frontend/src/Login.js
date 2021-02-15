import './App.css';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import {
  Link
} from "react-router-dom"

function Login() {
  const [placeholder, setPlaceholder] = useState('Error: Invalid request');
  useEffect(() => {
    fetch('/login').then(res => res.json()).then(data => {
      setPlaceholder(data.result);
    });
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();

  function handleSubmit(event) {
    //fetch inside here to verify with flask if credentials are correct
    //TODO: Add verigfication to amke sure they actually put in a legit email
    fetch("/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content_type": "application/json"
      },
      body: JSON.stringify(email + " " + password)
    }).then(response => response.json()).then(data => {
      //if credentials were correct go to home screen and pass values to next screen
      //else go back to login page 
    })
    cookies.set('Username', email, { path: '/' });
    cookies.set('Password', password, { path: '/' });
    console.log(cookies.get('Username'));
    Login.props.navigation.navigate('Home', {
      cookie: cookies,
    });
    event.preventDefault();
  }


  return (
    <div className="App">
      <p>
        Response from Flask: {placeholder}
      </p>
      <nav className="bar">
        <span> Cravr</span>
      </nav>
      <body className="App-body">
        <h1>
          Welcome to Cravr!
        </h1>
        <h2>
          Sign In
        </h2>
      </body>
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <a href="/Home" onClick={handleSubmit}>
            Login
            </a>
        </Form>
      </div>
      <div name="register" className="register">
        <button renderas="button" className="login-button" onClick={registerUser()}>
          <span>Register</span>
        </button>
      </div>
    </div>
  );
}
function registerUser() {
  //user put in data in login fields, clicks register and this sends data to flask to register the new user
}
export default Login;