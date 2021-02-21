import './App.css';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { BrowserRouter, Route} from "react-router-dom"



export default function Login() {
	const [placeholder, setPlaceholder] = useState('Error: Invalid request');
	// useEffect(() => {
	//   fetch('/login').then(res => res.json()).then(data => {
	//     setPlaceholder(data.result);
	//   });
	// }, []);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const cookies = new Cookies();

	function handleSubmit(event) {
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
		}).then(response => response.json()).then(response => {
			alert(response["result"]);
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

	function registerUser() {
		// user put in data in login fields, clicks register and this sends data to flask to register the new user
		// TODO This button should take the user to a "/Register" href where they fill out fields to create a new account
	}

	return (
		<div className="App">
			<nav className="bar">
				<span>Cravr</span>
			</nav>
			<body className="App-body">
				<h1>
					Register page TODO
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
						<button renderas="button" className="submit-button" href="/Home">
							<span>Login</span>
						</button>
					</div>
				</Form>
			</div>
			<br></br>
			<i>New to Cravr? Sign up!</i>
			<div name="register" className="register">
				<button renderas="button" className="submit-button" onClick={registerUser()}>
					<span>Register</span>
				</button>
			</div>
		</div>
	);
}
