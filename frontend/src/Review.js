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
        //TODO: make this run at page creation
        fetch("/get_reviews", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username")
            )
        }).then(response => {
            //decomp response and push onto state
            //TODO: decomp response into multiple elements
            this.state.Reviews.push( { id: 2, Name: 'Taco World', Distance: 23})
            const reviews = Object.assign([], this.state.Reviews);
            this.setState({ Reviews: reviews }) // must setState to update the actual render
        });
       
    }

    state = {
        Reviews: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions
            //init in constructor by backend
        ]
    }
    sendData = (data) => {
        //get restaurant data from backend to formulate the review
        fetch("/submit_review", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + data.id + " " + data.Rating + " " + data.Repeat+" " + data.Food+" " + data.Staff+" " + data.Atmos
            ) //food is a 1-5 rating +5 // staff is a 1-5 rating +10 // atmos is a 1-5 rating +15
        });
    }
    submit = (index, e) => {
        e.preventDefault();
        const reviews = Object.assign([], this.state.Reviews);
        const data = reviews.splice(index, 1);
        this.sendData(data);
        this.setState({ Reviews: reviews }) // must setState to update the actual render
        alert("Thank You for submitting a review! Please keep reviewing and requesting suggestions so we can get you better recommendations")
    }
    handleChange(index, event) {
        var reviews = Object.assign([], this.state.Reviews);
        //done this way bc event.target.name doesn't exist
        //TODO: needs a refactor into something easier but will be complex
        if (event.target.value <= 0) {
            //repeat
            reviews[index].Repeat = event.target.value    
        }else if(event.target.value >=1 && event.target.value <= 5){
            //userrating
            reviews[index].UserRating = event.target.value
        }else if(event.target.value <= 10){ 
            reviews[index].Food = event.target.value
        }else if(event.target.value <= 15){
            reviews[index].Staff = event.target.value
        }else if(event.target.value <= 20){
            reviews[index].Atmos = event.target.value
        } 
        this.setState({ Reviews: reviews })
    }
    render() {
        return (
            <div>
                <ul id="ResList">
                    {
                        //dynamic list element that is instantiated from state.Restaruants
                        //TODO: needs a refactor into something easier to control but will be complex
                        this.state.Reviews.map((Revs, index) => {
                            return (
                                <div className="Rest">
                                    <h1>{Revs.Name}</h1>
                                    <h3> Distance:{Revs.Distance} mi</h3>
                                    <form onSubmit={this.submit.bind(this, index)}>
                                        <label id="Question 1">
                                            How would you rate your experience on a scale of 1-5?
                                            <input type="number" className="textbox" defaultValue="1" min="1" max="5" onChange={this.handleChange.bind(this, index)} value={Revs.UserRating}></input>
                                        </label>
                                        <br></br>
                                        <label id="Question 2">
                                            Would you go here again?
                                            <select onChange={this.handleChange.bind(this, index)} className="textbox" value={Revs.Repeat}>
                                                <option value="0">Yes</option>
                                                <option value="-1">No</option>
                                            </select>
                                        </label>
                                        <br></br>
                                        <label id="Question 3">
                                            How would you rate the food on a scale of 1-5?
                                            <select onChange={this.handleChange.bind(this, index)} className="textbox" value={Revs.Food}>
                                                <option value="6">1</option>
                                                <option value="7">2</option>
                                                <option value="8">3</option>
                                                <option value="9">4</option>
                                                <option value="10">5</option>
                                            </select>
                                        </label>
                                        <br></br>
                                        <label id="Question 4">
                                            How would you rate the staff on a scale of 1-5?
                                            <select onChange={this.handleChange.bind(this, index)} className="textbox" value={Revs.Staff}>
                                                <option value="11">1</option>
                                                <option value="12">2</option>
                                                <option value="13">3</option>
                                                <option value="14">4</option>
                                                <option value="15">5</option>
                                            </select>
                                        </label>
                                        <br></br>
                                        <label id="Question 5">
                                            How would you rate the atmosphere on a scale of 1-5?
                                            <select onChange={this.handleChange.bind(this, index)} className="textbox" value={Revs.Atmos}>
                                                <option value="16">1</option>
                                                <option value="17">2</option>
                                                <option value="18">3</option>
                                                <option value="19">4</option>
                                                <option value="20">5</option>
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
