import React from 'react';
import './Home.css';
import { getCookie } from "./FindQuiz"
class ReviewContainer extends React.Component {
    //essentially scrollable list of reviews
    constructor(props) {
        super(props);
        this.sendData = this.sendData.bind(this);
        this.handleChange = this.handleChange.bind(this);

        //TODO: get user reviews from backend
    }
    state = {
        Reviews: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions
            //init in constructor by backend
            { id: 1, Name: 'Disney World', Distance: 1, UserRating: 1, Repeat: 0 },
            { id: 2, Name: 'Taco World', Distance: 23, UserRating: 1, Repeat: 0 }
        ]
    }
    sendData = (Repeat, Rating, id) => {
        //get restaurant data from backend to formulate the review
        fetch("/user-rating", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + Repeat + " " + Rating + " " + id
            )
        }).then(response => {

            //use response to add restaurant state
            //TODO: does this need do anything

        });
    }
    submit = (index, e) => {
        e.preventDefault();
        //TODO send review to backend
        const reviews = Object.assign([], this.state.Reviews);
        const data = reviews.splice(index, 1);
        this.sendData(data.Repeat, data.UserRating, data.id);
        this.setState({ Reviews: reviews }) // must setState to update the actual render
        alert("Thank You for submitting a review! Please keep reviewing and requesting suggestions so we can get you better recommendations")
    }
    handleChange(index, event) {
        var reviews = Object.assign([], this.state.Reviews);
        
        if (event.target.value <= 0) {
            //repeat
            reviews[index].Repeat = event.target.value
            this.setState({ Reviews: reviews })
        } else {
            //userrating
            reviews[index].UserRating = event.target.value
            this.setState({ Reviews: reviews })
        }
        
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
                                    <h1>{Revs.Name}</h1>
                                    <h3> Distance:{Revs.Distance} mi</h3>
                                    <form onSubmit={this.submit.bind(this, index)}>
                                        <label id="Question 1">
                                            How would you rate your experience on a scale of 1-5?
                                            <input type="number" className="textbox" defaultValue="1" min="1" max="5" onChange={this.handleChange.bind(this, index)} value={Revs.UserRating.value}></input>
                                        </label>
                                        <br></br>
                                        <label id="Question 2">
                                            Would you go here again?
                                            <select onChange={this.handleChange.bind(this, index)} className="textbox" value={Revs.Repeat.value}>
                                                <option value="0">Yes</option>
                                                <option value="-1">No</option>
                                            </select>
                                        </label>
                                        <br></br>
                                        <input className="submit-button" type="submit" value="Submit" />
                                    </form>
                                    <br></br>
                                </div>
                            )
                        })
                    }
                </ul>
            </div >
        );
    }
}

export default function Review() {
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
            <h1>Review</h1>
            <ReviewContainer></ReviewContainer>
        </div>
    );
}
