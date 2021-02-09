import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import {
    Link

} from "react-router-dom"
class QuizContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.state = { q1: '', q2: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    fetchPreferences(email, pass) {
        //fetch this users answers to the quiz
    }
    handleChange(event){
        this.setState({[event.target.name]: event.target.value});
    }
    handleSubmit(event){
        //send data to server
        event.preventDefault();
    }
    render() {
        return (
            <div id="Quiz">
                <form onSubmit={this.handleSubmit}>
                    <label id="Question 1">
                        1. Pick your favorite food:
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                        </select>
                    </label>
                    <br/>
                    <label id="Question 2">
                        2. Pick your least favorite food:
                        <select value={this.state.value} onChange={this.handleChange}>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                        </select>
                    </label>
                    <br/>
                    <input type="submit" value="Submit" className="login-button"/>
                </form>
            </div>
        );
    }
}
export default function review() {
    return (
        <div className="Home">
            <nav>
                <ul id="nav">
                    <li><a href="/Home">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Preferences</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
            <h1>User Preferences</h1>
            <QuizContainer></QuizContainer>
            <Link to="/">
                <button renderas="button" className="login-button">
                    <span>Back</span>
                </button>
            </Link>
        </div>
    );
}