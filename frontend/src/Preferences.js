import React from 'react';
import './Home.css';
import { useHistory } from "react-router-dom";
import { getCookie } from "./FindQuiz"
class SettingsContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.state = { q1: '', q2: '', q3: '', q4: '' };
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
        event.preventDefault();
    }
    render() {
        return (
            <div id="Settings">
                <form>
                    <label id="Q1">
                        Push Notifications?
                        <select>
                            <option value="0">Yes</option>
                            <option value="-1">No</option>
                        </select>
                    </label>
                    <br/>
                    <label id="Q2">
                        Wack
                        <select>
                            <option value="0">Yes</option>
                            <option value="-1">No</option>
                        </select>
                    </label>
                    <br/>
                    <h3>Our Story</h3>
                    <p>We are a team of 3 college students who ...</p>
                </form>
            </div>
        );
    }
}

export default function Preferences() {
    if(getCookie("Username") === ""){
        GoLogin()
    }
    return (
        <div className="Home">
            <nav>
                <ul id="nav">
                    <li><a href="/">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Settings</a></li>
                    <li><a href="/Login">Logout</a></li>
                </ul>
            </nav>
            <br></br>
            <h1>Settings TODO</h1>
            <SettingsContainer></SettingsContainer>
        </div>
    );
}
function GoLogin(){
    const history = useHistory();
    history.push('/Login');
}