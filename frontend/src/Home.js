import React from 'react';
import './Home.css';
import {
    Link
} from "react-router-dom"

class Restaurant extends React.Component {
    user;
    price;
    rating;
    address;
    distance = 1.3;//in mi
    name;
    category;
    constructor(props) {    // TODO Instantiation should be handled through backend
        super(props);
        //get a restaurant from the server and set id to that name
        //set some vars that will need later
        this.user = "john doe";
        this.price = "$$$";
        this.rating = 4.3;
        this.address = "1234 mickey lane";
        this.name = "Disney World";
        this.category = "American"
        //pic?
    }
    render() {
        return (
            <div>
                <h1>{this.name}</h1>
                <h3>{this.address} Distance:{this.distance}mi</h3>
                <h5>Price:{this.price} Rating:{this.rating}/5 Category:{this.category}</h5>
                <button>Yummy!</button> <button>Yuck</button>
            </div>
        );
    }
}
class RestaurantContainer extends React.Component {
    //essentially scrollable list of restaurant 
    //dynamic list of restaurant elements
    constructor(props) {
        super(props);
        this.RestaurantRated = this.RestaurantRated.bind(this);
    }

    RestaurantRated() {
        // TODO Frontend change button color. Backend update user profile
    }

    render() {
        return (    // TODO make request to backend to fetch list of restuarants from Yelp API
            <ol>
                <li>
                    <Restaurant></Restaurant>
                </li>
                <li>
                    <Restaurant></Restaurant>
                </li>
            </ol>
        );
    }
}

export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export default function Home() {
    return (
        <div>
            <nav>
                <ul id="nav">
                    <li><a href="/Home">Find</a></li>
                    <li><a href="/Review">Review</a></li>
                    <li><a href="/Preferences">Preferences</a></li>
                    <li><a href="/">Logout</a></li>
                </ul>
            </nav>

            {/* <h1>{getCookie("Username")}</h1>
            <h1>{getCookie("Password")}</h1> */}
            <h1>Find</h1>
            <RestaurantContainer></RestaurantContainer>
        </div>
    );
}
