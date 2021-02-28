import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import { getCookie } from "./FindQuiz"
import {
    Link

} from "react-router-dom"
class ReviewContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.getUserReview = this.getUserReview.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    state = {
        Reviews: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions

            { id: 1, Name: 'Disney World', Distance: 1, UserRating: 0, Repeat: 0 },
            { id: 2, Name: 'Taco World', Distance: 23, UserRating: 0, Repeat: 0 }
        ]
    }
    getUserReview = () => {
        //get restaurant data from backend to formulate the review
        fetch("/rated", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + "hello"
            )
        }).then(response => {
            //use response to add restaurant state
            const reviews = Object.assign([], this.state.Reviews);
            reviews.push(response);
            //restaurants.push({ id: 1, Name: 'Hello World', Distance: 1, Price: "$$", Rating: 3 });
            this.setState({ Reviews: reviews }) // must setState to update the actual render
        });
    }
    submit = (index, e) => {
        //TODO send review to backend
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    render() {
        return (
            <div>
                <ul id="ResList">
                    {
                        //dynamic list element that is instantiated from state.Restaruants
                        this.state.Reviews.map((Revs, index) => {
                            return (
                                <div className="Rest">
                                    <UserRev id={Revs.id}
                                        name={Revs.Name}
                                        distance={Revs.Distance}
                                        UserRating={Revs.UserRating}
                                        Repeat={Revs.Repeat}
                                        change={this.handleChange.bind(this)}
                                        submit={this.submit.bind(this, index)}>
                                    </UserRev>
                                    <br></br>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}
//TODO: get list of unreviewed restaurants for a user form backend
const UserRev = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <h3> Distance:{props.distance} mi</h3>
            <form onSubmit={props.submit}>
                <label id="Question 1">
                    How would you rate your experience on a scale of 1-5?
                        <input type="number" defaultValue="1" min="1" max="5" onChange={props.change}></input>
                </label>
                <br></br>
                <label id="Question 2">
                    Would you go here again?
                    <select onChange={props.change}>
                            <option value="0">Yes</option>
                            <option value="1">No</option>
                    </select>
                </label>
                <br></br>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
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
