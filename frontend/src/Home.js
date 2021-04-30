import React from 'react';
import './Home.css';
import './App.css';
import FindQuizContainer from './FindQuiz.js';
import { useHistory } from "react-router-dom";
import { getCookie } from "./FindQuiz"

export default function Home() {
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
            <FindQuizContainer></FindQuizContainer>
        </div>
    );
}
function GoLogin(){
    const history = useHistory();
    history.push('/Login');
}