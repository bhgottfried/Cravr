import React from 'react';
import './Home.css';
import './App.css';

export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}


const Restaurant = (props) => {
    return (
        <div>
            <h2 className="underline">{props.name}</h2>
            <h3> Distance:{props.distance} mi</h3>
            <h4>Price:{props.price} Rating:{props.rating}/5</h4>
            <h4>Address:{props.addr.address1}</h4>
            <img className="Image" src={props.image} alt=""/>
            <br/>
            <button className="submit-button" onClick={props.accept}>Yummy!</button> 
            <button className="submit-button" onClick={props.later}>Maybe Later</button>
            <button className="submit-button" onClick={props.reject}>Yuck</button>
        </div>
    )
}


class FindQuizContainer extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            q1: '',
            q2: '$',
            q3: '1',
            showRes: false,
            lastSubmit: '',
            Restaurants: []     // Probably shouldn't be a list since there's at most one, but refactor is hard...
        };

        this.setRestaurant = this.setRestaurant.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.whatsGood = this.whatsGood.bind(this);
    }

    setRestaurant = (restaurant) => {
        this.setState({ Restaurants: [restaurant] });
    }

    accept = (e) => {
        e.preventDefault()
        let restaurant = this.state.Restaurants.pop();
        this.setState({ Restaurants: [], showRes: false });
        if (restaurant.id !== "N/A") {
            this.rateRestaurant("yummy", restaurant.id);
            alert("Have a nice meal! After you eat, don't forget to rate your experience for even better recommendations!");
        } else {
            this.handleSubmit(e, this.lastSubmit);   // Try to get new restaurant
        }
    }

    later = (e) =>{
        e.preventDefault()
        let restaurant = this.state.Restaurants.pop();
        this.handleSubmit(e, this.lastSubmit);   // Get new restaurant
        if (restaurant.id !== "N/A") {
            this.rateRestaurant("maybe later", restaurant.id);
        }
    }

    reject = (e) => {
        e.preventDefault()
        let restaurant = this.state.Restaurants.pop();
        this.handleSubmit(e, this.lastSubmit);   // Get new restaurant
        if (restaurant.id !== "N/A") {
            this.rateRestaurant("yuck", restaurant.id);
        }
    }

    rateRestaurant = (rating, restaurantID) => {
        return fetch("/cravr/rate_suggestion", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + "\n" +
                rating + "\n" +
                restaurantID
            )
        })
    }

    getRestaurant = (position) => {
        fetch("/cravr/restaurants", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + "\n" +
                this.state.q1 + "\n" +
                this.state.q2 + "\n" +
                this.state.q3 + "\n" +
                position.coords.latitude + "\n" +
                position.coords.longitude
            )
        }).then(response => response.json())
        .then(response => this.setRestaurant(response.result));

        this.setState({ showRes: true, lastSubmit: "search" });
    }

    whatsGood = (position) => {
        fetch("/cravr/whats_good", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + "\n" +
                position.coords.latitude + "\n" +
                position.coords.longitude
            )
        }).then(response => response.json())
        .then(response => this.setRestaurant(response.result));

        this.setState({ showRes: true, lastSubmit: "whatsGood" });
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event, caller) => {
        event.preventDefault();
        if (caller === undefined) { // JS is so weird, but this fixes an issue I've spent an hour on...
            caller = this.state.lastSubmit;
        }

        let func = null;
        switch (caller) {
            case "search":
                func = this.getRestaurant;
                break;
            case "whatsGood":
                func = this.whatsGood;
                break;
            default:
                func = this.getRestaurant;
        }

        navigator.geolocation.getCurrentPosition(func, () => {
            alert("You must enable your location to receive personalized restaurant suggestions.");
        });
    }

    render() {
        return (
            <div>
            <h1>Find Restaurants Near You</h1>
                <div id="Quiz" className="Rest">
                    <h2>Search Filters</h2>
                    <form onSubmit={e => this.handleSubmit(e, "search")}>
                        <label id="q1" className="largetext">
                            1. What are you in the mood for? 
                            <input type="text" className="text" value={this.state.q1.value} name="q1"
                                required onChange={this.handleChange}>
                            </input>
                        </label>
                        <br />
                        <label id="q2" className="largetext">
                            2. How much would you prefer to spend?&emsp;&emsp;
                            <select value={this.state.q2.value} className="textbox" required onChange={this.handleChange} name="q2">
                                <option value="$">$</option>
                                <option value="$$">$$</option>
                                <option value="$$$">$$$</option>
                                <option value="$$$$">$$$$</option>
                            </select>
                        </label>
                        <br />
                        <label id="q3" className="largetext">
                            3. Maximum Distance (mi.)&emsp;
                            <input type="number" className="textbox" defaultValue="1" min="1" max="24" value={this.state.q3.value} name="q3"
                                required onChange={this.handleChange}>
                            </input>
                        </label>
                        <br />
                        <br></br>
                        <input type="submit" value="Search" className="submit-button" />
                        <br />
                        <br></br>
                    </form>
                    <div id="whatsGood">
                        <h2>Best Local Restaurants For You</h2>
                        <form onSubmit={e => this.handleSubmit(e, "whatsGood")}>
                            <input type="submit" value="What's good?" className="submit-button" />
                        </form>
                        <br/>
                    </div>
                    <div id="results" className="Rest">
                    <h2>Results:</h2>
                    {this.state.showRes ?
                        //dynamic list element that is instantiated from state.Restaruants
                        this.state.Restaurants.map((Rest) => {
                            return (
                                <div className="Results">
                                    <Restaurant id={Rest.id}
                                        name={Rest.Name}
                                        distance={Rest.Distance}
                                        price={Rest.Price}
                                        rating={Rest.Rating}
                                        image={Rest.Image}
                                        addr={Rest.Location}
                                        accept={this.accept.bind(this)}
                                        reject={this.reject.bind(this)}
                                        later={this.later.bind(this)}>
                                    </Restaurant>
                                    <br></br>
                                </div>
                            )
                        }) : null}
                    <br/>
                    <br/>
                </div>
                </div>

                

                <br></br>
            </div>
        );
    }
}


export default FindQuizContainer;
