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
	const [fav, setFav] = useState("");
	const [leastfav, setLeastFav] = useState("");
	const [atmos, setAtmos] = useState("");
	const [serv, setServ] = useState("");
	const [food, setFood] = useState("");
	const [value, setValue] = useState("");
	const cookies = new Cookies();

	const history = useHistory();
	const routeChange = path => {
		history.push(path);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if(email === ""){
			alert("Error: Email must not be blank");
			return;
		}
		if(password === ""){
			alert("Error: Password must not be blank");
			return;
		}
		if (password !== confirm) {
			alert("Error: Passwords must match!");
			return;
		}
		if(fav==="" || leastfav==="" || atmos==="" || serv==="" || food==="" || value===""){
			alert("Error: Quiz responses must not be blank")
			return;
		}

		fetch("/cravr/register", {
			method: "POST",
			cache: "no-cache",
			headers: {
				"content_type": "application/json"
			},
			body: JSON.stringify(email + "\n" + password + "\n" + JSON.stringify( {
				"favorite": fav,
				"leastFavorite": leastfav,
				"food": food,
				"service": serv,
				"atmosphere": atmos,
				"value": value
			}))
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
							className="text-box"
						/>
					</Form.Group>
					<Form.Group size="lg" controlId="password">
						<Form.Label>&emsp; &emsp; &emsp; Password: </Form.Label>
						<Form.Control
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="text-box"
						/>
					</Form.Group>
					<Form.Group size="lg" controlId="password">
						<Form.Label>Confirm Password: </Form.Label>
						<Form.Control
							type="password"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							className="text-box"
						/>
					</Form.Group>
					<body className="App-body">
						<h1 >Personalize your recommendations</h1>
					</body>
					<Form.Group>
						<Form.Label>Favorite Food? </Form.Label>
						<Form.Control as="select" value={fav} onChange={(e) => setFav(e.target.value)} className="drop-down">
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
						<Form.Label>Least Favorite Food? </Form.Label>
						<Form.Control as="select" value={leastfav} onChange={(e) => setLeastFav(e.target.value)} className="drop-down">
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
					<body className="App-body">
						<h3 >When choosing a restaurant, please rate from 1-5 (5 is best) how important each of the following are to you: </h3>
					</body>
					<Form.Group>
						<Form.Label>Food: </Form.Label>
						<Form.Control
							as="input" type="number" min="1" max="5" onChange={(e) => setFood(e.target.value)} value={food} className="text-box">
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>Service: </Form.Label>
						<Form.Control
							as="input" type="number" min="1" max="5" onChange={(e) => setServ(e.target.value)} value={serv} className="text-box">
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>Atmosphere: </Form.Label>
						<Form.Control
							as="input" type="number" min="1" max="5" onChange={(e) => setAtmos(e.target.value)} value={atmos} className="text-box">
						</Form.Control>
					</Form.Group>
					<Form.Group>
						<Form.Label>Value: </Form.Label>
						<Form.Control
							as="input" type="number" min="1" max="5" onChange={(e) => setValue(e.target.value)} value={value} className="text-box">
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
