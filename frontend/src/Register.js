import './App.css';
import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import { attemptLogin } from "./Login"


export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [fav,setFav] = useState("");
	const [leastfav,setLeastFav] = useState("");
	const [atmos,setAtmos] = useState("");
	const [serv,setServ] = useState("");
	const [food,setFood] = useState("");
	const cookies = new Cookies();

	const history = useHistory();
	const routeChange = path => {
		history.push(path);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (password !== confirm) {
			alert("Error: Passwords must match!");
			return;
		}
		if(fav==="" || leastfav==="" || atmos==="" || serv==="" || food===""){
			alert("Error: Quiz responses must not be blank")
			return;
		}
		fetch("/cravr/register", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"content_type": "application/json"
			},
			body: JSON.stringify(email + "\n" + password + "\n"+ fav +"\n"+leastfav+"\n"+atmos+"\n"+serv+"\n"+food)
		}).then(response => response.json())
			.then(response => {
				if (response.result === "/Login") {
					attemptLogin(email, password).then(function (res) {
						if (res === "/") {
							var CryptoJS = require("crypto-js");
							cookies.set('Username', email, { path: '/' });
							cookies.set('Password', CryptoJS.AES.encrypt(password, 'CravrisCool').toString(), { path: '/' });
							console.log(cookies.get('Password'));
						}
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
					<h3 >Please fill out this initialization quiz below.</h3>
					<Form.Group>
						<Form.Label>1. Favorite Food?</Form.Label>
						<Form.Control as="select" value={fav} onChange={(e) => setFav(e.target.value)}>
							<option value=""> </option>
							<option value="Bar & Grill">Bar & Grill</option>
							<option value="Sandwiches">Sandwiches</option>
							<option value="Pizza">Pizza</option>
							<option value="Fast Food">Fast Food</option>
							<option value="Breakfast">Breakfast</option>
							<option value="Steakhouse">Steakhouse</option>
							<option value="Fine Dining">Fine Dining</option>
							<option value="Sushi">Sushi</option>
							<option value="Seafood">Seafood</option>
							<option value="Barbeque">Barbeque</option>
							<option value="American">American</option>
							<option value="Mexican">Mexican</option>
							<option value="South American">South American</option>
							<option value="Italian">Italian</option>
							<option value="Eastern European">Eastern European</option>
							<option value="Mediterranean">Mediterranean</option>
							<option value="Middle Eastern">Middle Eastern</option>
							<option value="Indian">Indian</option>
							<option value="Chinese">Chinese</option>
							<option value="Japanese">Japanese</option>
							<option value="Korean">Korean</option>
							<option value="Southeast Asian">Southeast Asian</option>
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>2. Least Favorite Food?</Form.Label>
						<Form.Control as="select" value={leastfav} onChange={(e) => setLeastFav(e.target.value)}>
							<option value=""> </option>
							<option value="Bar & Grill">Bar & Grill</option>
							<option value="Sandwiches">Sandwiches</option>
							<option value="Pizza">Pizza</option>
							<option value="Fast Food">Fast Food</option>
							<option value="Breakfast">Breakfast</option>
							<option value="Steakhouse">Steakhouse</option>
							<option value="Fine Dining">Fine Dining</option>
							<option value="Sushi">Sushi</option>
							<option value="Seafood">Seafood</option>
							<option value="Barbeque">Barbeque</option>
							<option value="American">American</option>
							<option value="Mexican">Mexican</option>
							<option value="South American">South American</option>
							<option value="Italian">Italian</option>
							<option value="Eastern European">Eastern European</option>
							<option value="Mediterranean">Mediterranean</option>
							<option value="Middle Eastern">Middle Eastern</option>
							<option value="Indian">Indian</option>
							<option value="Chinese">Chinese</option>
							<option value="Japanese">Japanese</option>
							<option value="Korean">Korean</option>
							<option value="Southeast Asian">Southeast Asian</option>
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>3. How important is Atmosphere to you when you eat on a scale form 1-5?</Form.Label>
						<Form.Control as="select" value={atmos} onChange={(e) => setAtmos(e.target.value)}>
							<option value=""> </option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>4. How important is the Service to you when you eat on a scale form 1-5?</Form.Label>
						<Form.Control as="select" value={serv} onChange={(e) => setServ(e.target.value)}>
							<option value=""> </option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>5. How important is the Food to you when you eat on a scale form 1-5?</Form.Label>
						<Form.Control as="select" value={food} onChange={(e) => setFood(e.target.value)}>
							<option value=""> </option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Control>
					</Form.Group>
					<br/>
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
				<button renderas="button" className="secondary-button" onClick={() => routeChange("/Login")}>
					<span>Back to sign in</span>
				</button>
			</div>
		</div>
	);
}
