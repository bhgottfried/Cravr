import React from 'react';
import './Home.css';
//import { Navbar,  Nav} from 'rsuite';
import { getCookie } from "./FindQuiz"
class ReviewContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.getNewUserReview = this.getNewUserReview.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state = {
        Reviews: [
            // Start with empty list and add reviews from backend
            // TODO: get actual reviews when page is created
            //TODO: if no reviews display default sorry go eat somewhere so we can get you better recommendations

            { id: 1, Name: 'Disney World', Distance: 1, UserRating: 1, Repeat: 0 },
            { id: 2, Name: 'Taco World', Distance: 23, UserRating: 1, Repeat: 0 }
        ]
    }
    getNewUserReview = (rating, repeat) => {
        //get restaurant data from backend to formulate the review
        fetch("/rating", { //TODO: figure out backend handle
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + " " + this.state.Reviews
            )
        }).then(response => {
            const reviews = Object.assign([], this.state.Reviews);
            reviews.push(response);
            this.setState({ Reviews: reviews })
        });
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit(event, index) {
        //WIP
        //TODO: get data from delted entry and send it using getNewUserRevew()
        const reviews = Object.assign([], this.state.Reviews);
        reviews.splice(index, 1)
        this.setState({ Reviews: reviews })
        alert("review Submitted. Thanks! ");

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
                                        rating={Revs.UserRating}
                                        repeat={Revs.Repeat}
                                        change={this.handleChange.bind(this)}
                                        submit={this.handleSubmit.bind(this, index)}>
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
const UserRev = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <h3> Distance:{props.distance} mi</h3>
            <form onSubmit={
                (e) => { //Need this to stop page from reloading wiht every submission
                    e.preventDefault();
                    e.stopPropagation();
                    props.submit();
                }}>
                <label id="Question 1">
                    How would you rate your experience on a scale of 1-5?
                        <input type="number" defaultValue="1" min="1" max="5" required onChange={props.change} value={props.UserRating}></input>
                </label>
                <br></br>
                <label id="Question 2">
                    Would you go here again?
                    <select required onChange={props.change} value={props.Repeat}>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                    </select>
                </label>
                <br></br>
                <input type="submit" value="Submit Review" className="tertiary-button" />
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
