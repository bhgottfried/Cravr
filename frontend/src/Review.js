import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import { getCookie } from "./Home"
import {
    Link

} from "react-router-dom"
class ReviewContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
    }
    // TODO This shouldn't be binary like/dislike. We need to make a more nuanced survey
    render() {
        return (
            <ol>
                <li>
                    <UserRev></UserRev>
                    <form>
                        <label id="Question 1">
                            1. Pick your favorite food:
                                <input type="text">
                                </input>
                        </label>
                    </form>
                    <button>Rate!</button>
                </li>
                <li>
                    <UserRev></UserRev>
                    <button>Yummy!</button> <button>Rate!</button>
                </li>
            </ol>
        );
    }
}
//TODO: get list of unreviewed restaurants for a user form backend
//TODO: determine user feedback needed
class UserRev extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<h1>hello</h1>);
    }
}
export default function Review() {
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
            <h1>Review</h1>
            <ReviewContainer></ReviewContainer>
        </div>
    );
}
