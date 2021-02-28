import React from 'react';
import {getCookie} from "./FindQuiz.js";

const Restaurant = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <h3> Distance:{props.distance} mi</h3>
            <h5>Price:{props.price} Rating:{props.rating}/5</h5>
            <button onClick={props.accept}>Yummy!</button> <button onClick={props.delete}>Yuck</button>
        </div>
    )
}


class RestaurantContainer extends React.Component {
    constructor(props) {
        super(props);
        this.replaceRest = this.replaceRest.bind(this);
    }

    state = {
        Restaurants: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions

            { id: 1, Name: 'Disney World', Distance: 1, Price: "$$", Rating: 3 }
        ]
    }
    replaceRest = (name,rating) => {
        //fetch restuarant from backend
        //1 accepted, 0 hated 
        fetch("/restaurants", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") +" "+ name +" "+ rating
            )
        }).then(response => {
            //use response to add restaurant state
            const restaurants = Object.assign([], this.state.Restaurants);
            restaurants.push(response);
            //restaurants.push({ id: 1, Name: 'Hello World', Distance: 1, Price: "$$", Rating: 3 });
            this.setState({ Restaurants: restaurants }) // must setState to update the actual render
        });
        
    }
    accept = (index, e) => {
        const restaurants = Object.assign([], this.state.Restaurants);
        const accepted = restaurants.splice(index, 1); // send this restaurant data to backend for feedback
        this.setState({ Restaurants: restaurants })
        //TODO: fetch a new restaurant from the backend to replace this element, also send data
        this.replaceRest(accepted.values(),1);
        
    }

    delete = (index, e) => {
        const restaurants = Object.assign([], this.state.Restaurants);
        const deleted = restaurants.splice(index, 1); // send this restaurant data to backend for feedback
        this.setState({ Restaurants: restaurants })
        //TODO: fetch a new restaurant from the backend to replace this element, also send data
        this.replaceRest(deleted.values(),0);
    }

    render() {
        return (
            <div>
                <ul id="ResList">
                    {
                        //dynamic list element that is instantiated from state.Restaruants
                        this.state.Restaurants.map((Rest, index) => {
                            return (
                                <div className="Rest">
                                    <Restaurant id={Rest.id}
                                        name={Rest.Name}
                                        distance={Rest.Distance}
                                        price={Rest.Price}
                                        rating={Rest.Rating}
                                        accept={this.accept.bind(this, index)}
                                        delete={this.delete.bind(this, index)}>
                                    </Restaurant>
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


export default RestaurantContainer;
