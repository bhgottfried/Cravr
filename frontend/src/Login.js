import './App.css';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import Register from "./Register";

function Login() {
  const [placeholder, setPlaceholder] = useState('Error: Invalid request');
  // useEffect(() => {
  //   fetch('/login').then(res => res.json()).then(data => {
  //     setPlaceholder(data.result);
  //   });
  // }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("/");
  const cookies = new Cookies();

  const history = useHistory();
  const routeChange = path => { 
    history.push(path);
  }

  function handleSubmit() {
    //fetch inside here to verify with flask if credentials are correct
    //TODO: Add verification to make sure they actually put in a legit email
      // (We can use a regex for this but I don't want to yet so I can use asdf for my test email)
    fetch("/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content_type": "application/json"
      },
      // TODO Send login credentials over SSL
      body: JSON.stringify(email + "\n" + password)
    }).then(response => response.json())
    .then(response => {
      setPath(response["result"]);
    }).catch((error) => console.error(error));

    cookies.set('Username', email, { path: '/' });
    cookies.set('Password', password, { path: '/' });
    console.log(cookies.get('Username'));
    // Login.props.navigation.navigate('Home', {  // Do we need this at all?
    //   cookie: cookies,
    // });
    routeChange("/Home")
  }

  return (
    <div className="App">
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
            <button renderas="button" className="submit-button">
              <span>Login</span>
            </button>
          </div>
        </Form>
      </div>
      <br></br>
      <i>New to Cravr? Sign up!</i>
      <div name="register" className="register">
        <button renderas="button" className="submit-button" onClick={() => routeChange("/Register")}>
          <span>Register</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
