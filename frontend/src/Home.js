import React from 'react';
import './Home.css';
import FindQuizContainer from './FindQuiz.js';


export default function Home() {
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
            <FindQuizContainer></FindQuizContainer>
        </div>
    );
}
