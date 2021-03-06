import React from 'react';
import './Home.css';
// import { getCookie } from "./Home"
class QuizContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.state = { q1: '', q2: '',q3:'',q4:'' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    fetchPreferences(email, pass) {
        //fetch this users answers to the quiz
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit(event) {
        //send data to 
        //body will probably look like this JSON.stringify(this.state.q1.value +" "+this.state.q2.value +" "+ this.state.q3.value +" "+ this.state.q4.value);
        event.preventDefault();
    }
    render() {
        return (
            <div id="Quiz">
                <form onSubmit={this.handleSubmit}>
                    <label id="Question 1">
                        1. Pick your favorite food:
                        <select value={this.state.q1.value} onChange={this.handleChange}>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Subs">Subs</option>
                            <option value="Fast Food">Fast Food</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 2">
                        2. Pick your least favorite food:
                        <select value={this.state.q2.value} onChange={this.handleChange}>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Subs">Subs</option>
                            <option value="Fast Food">Fast Food</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 3">
                        3. Preferred budget?
                        <select value={this.state.q3.value} onChange={this.handleChange}>
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 4">
                        4. Maximum Distance you are willing to travel (in miles)?
                        <input type="text" pattern="[0-9]*"value={this.state.q4.value} onChange={this.handleChange}></input>
                    </label>
                    <br />
                    <br></br>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
            </div>
        );
    }
}

export default function Preferences() {
    return (
        <div className="Home">
            <nav>
                <ul id="nav">
                    <li><a href="/">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Preferences</a></li>
                    <li><a href="/Login">Logout</a></li>
                </ul>
            </nav>
            <br></br>
            <h1>User Preferences</h1>
            <QuizContainer></QuizContainer>
        </div>
    );
}
