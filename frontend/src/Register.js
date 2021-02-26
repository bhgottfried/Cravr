import './App.css';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import { attemptLogin } from "./Login"


export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const cookies = new Cookies();

	const history = useHistory();
	const routeChange = path => { 
		history.push(path);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (password != confirm) {
			alert("Error: Passwords must match!");
			return;	// TODO make this not clear the data after submitting
		}

		cookies.set('Username', email, { path: '/' });
		cookies.set('Password', password, { path: '/' });
		console.log(cookies.get('Username'));

		fetch("/register", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"content_type": "application/json"
			},
			body: JSON.stringify(email + "\n" + password)
		}).then(response => response.json())
		.then(response => {
			if (response.result) {
				attemptLogin(email, password).then(function(res){
					routeChange(res);
				});
			} else {
				alert("An account for that email already exists.");
				routeChange("/Register");
			}
		});
	}
	
	return (
		<div className="App">
			<nav className="bar">
				<span>Cravr</span>
			</nav>
			<body className="App-body">
				<h1>
					Sign up for Cravr
				</h1>
			</body>
			<div className="login-form">
				<Form onSubmit={handleSubmit}>
					<Form.Group size="lg" controlId="email">
						<Form.Label>&emsp; &emsp; &emsp; &emsp; Email: </Form.Label>
						<Form.Control
							autoFocus
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group size="lg" controlId="password">
						<Form.Label>&emsp; &emsp; &emsp; Password: </Form.Label>
						<Form.Control
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group size="lg" controlId="password">
						<Form.Label>Confirm Password: </Form.Label>
						<Form.Control
							type="password"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
						/>
					</Form.Group>
					<br></br>
					<div name="login" className="register">
						<button renderas="button" className="primary-button">
							<span>Register</span>
						</button>
					</div>
				</Form>
			</div>
			<br></br>
			<i>Already have an account?</i>
			<div name="register" className="login">
				<button renderas="button" className="secondary-button" onClick={() => routeChange("/")}>
					<span>Back to sign in</span>
				</button>
			</div>
		</div>
	);
}
