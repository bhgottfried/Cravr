import React from 'react';
import './Home.css';
import { useHistory } from "react-router-dom";
import { getCookie } from "./FindQuiz"

class ReviewContainer extends React.Component {
    constructor(props) {
        super(props);
        this.sendData = this.sendData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setReview = this.setReview.bind(this);

        fetch("/cravr/get_reviews", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username")
            )
        }).then(response => response.json())
        .then(response => this.setReview(response.result));
    }

    state = {
        Reviews: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions
            //init in constructor by backend
        ],
        None: 1
    }

    setReview = (rest) => {
        if (rest[0].None === "1") {
            this.setState({ None: 1 });
        } else {
            this.setState({ None: 0 });
            this.setState({ Reviews: rest })
        }
    }

    sendData = (rest_id, review) => {
        fetch("/cravr/submit_review", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(getCookie("Username") + "\n" + rest_id + "\n" + JSON.stringify(review))
        });
    }

    submit = (index, event) => {
        event.preventDefault();
        let reviews = Object.assign([], this.state.Reviews);
        let removed = reviews.splice(index, 1);
        this.sendData(removed[0].restaurant.id, removed[0].review);
        this.setState({ Reviews: reviews, None: reviews.length === 0 })
        alert("Thank you for your review! Please keep reviewing and requesting suggestions for better recommendations")
    }

    handleChange(index, event) {
        let reviews = Object.assign([], this.state.Reviews);
        reviews[index].review[event.target.name] = event.target.value;
        this.setState({ Reviews: reviews, None: reviews.length === 0 })
    }

    render() {
        return (
            <div>
                {
                    this.state.None ? <div className="Rest"><h2>No restaurants to review at this time</h2></div> : this.state.Reviews.map((Revs, index) => { return (
                            <div className="Rest">
                                <h1 className="underline">{Revs.restaurant.name}</h1>
                                <h2>Location: {Revs.restaurant.location.address1}</h2>
                                <h2>Please rate the following from 1-5 (5 is best)</h2>
                                <form onSubmit={this.submit.bind(this, index)} className="find-form">
                                    <div className="test">
                                    <label id="Question 1" className="largetext">
                                        Food: 
                                        <input
                                            type="number" className="textbox" defaultValue="5" min="1" max="5" name="food"
                                            onChange={this.handleChange.bind(this, index)} value={Revs.review.food}>
                                        </input>
                                    </label>
                                    <br></br>
                                    <label id="Question 2" className="largetext">
                                        Service: 
                                        <input
                                            type="number" className="textbox" defaultValue="5" min="1" max="5" name="service"
                                            onChange={this.handleChange.bind(this, index)} value={Revs.review.service}>
                                        </input>
                                    </label>
                                    <br></br>
                                    <label id="Question 3" className="largetext">
                                        Atmosphere: 
                                        <input
                                            type="number" className="textbox" defaultValue="5" min="1" max="5" name="atmosphere"
                                            onChange={this.handleChange.bind(this, index)} value={Revs.review.atmosphere}>
                                        </input>
                                    </label>
                                    <br></br>
                                    <label id="Question 4" className="largetext">
                                        Experience: 
                                        <input
                                            type="number" className="textbox" defaultValue="5" min="1" max="5" name="overall"
                                            onChange={this.handleChange.bind(this, index)} value={Revs.review.overall}>
                                        </input>
                                    </label>
                                    <br></br>
                                    <label id="Question 5" className="largetext">
                                        Would you go here again? 
                                        <select  className="textbox" name="repeat" onChange={this.handleChange.bind(this, index)} value={Revs.review.repeat}>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </label>
                                    <br></br>
                                    <input className="submit-button" type="submit" value="Submit" />
                                    </div>
                                </form>
                                <br></br>
                            </div>
                        )
                    })
                }
            </div >
        );
    }
}

export default function Review() {
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
            <h1>Review</h1>
            <ReviewContainer></ReviewContainer>
        </div>
    );
}

function GoLogin(){
    const history = useHistory();
    history.push('/Login');
}
