import './App.css';
import React,{ useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  Link
} from "react-router-dom"

function Login() {
  const [placeholder, setPlaceholder] = useState('Error: Invalid request');
  useEffect(() => {
    fetch('/hello').then(res => res.json()).then(data => {
      setPlaceholder(data.result);
    });
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    //fetch inside here to verify with flask if crdentials are correct
    //THIS DOESN'T RUN WHEN USING LINK on BUTTON, NEED TO FIND ANOTHER WAY TO IMPLEMENT PAGE SWITCHING probably with history.push
    /*
      fetch("/login",{
      method:"POST",
      cache:"no-cache",
      headers:{
        "content_type":"application/json"
      },
      body:JSON.stringify(this.state.user +" "+this.state.pass)
    }).then(response => response.json()).then(data => {
      if credentials were correct go to home screen and pass values to next screen
      else go back to login page 
    })
    });
    */
   fetch('/hello').then(res => res.json()).then(data => {
    setPlaceholder(data.result);
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
        <Link to="/Home">
          <Button block size="lg" type="submit" className="login-button">
            Login
          </Button>
        </Link>
      </Form>
    </div>
    <div name="register" className="register">
        <button renderas="button" className="login-button" onClick={registerUser()}>
          <span>register</span>
        </button>
    </div>
  </div>
  );
}
function registerUser(){
  //user put in data in login fields, clicks register and this sends data to flask to register the new user
}
export default Login;