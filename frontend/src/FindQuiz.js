import React from 'react';


export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}


const Restaurant = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <h3> Distance:{props.distance} mi</h3>
            <h5>Price:{props.price} Rating:{props.rating}/5</h5>
            <button onClick={props.accept}>Yummy!</button> <button onClick={props.reject}>Yuck</button>
        </div>
    )
}


class FindQuizContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            q1: 'Bar & Grill',
            q2: '$',
            q3: '1',
            showRes: false,
            Restaurants: []     // Probably shouldn't be a list since there's at most one, but refactor is hard...
        };
        this.setRestaurant = this.setRestaurant.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setRestaurant = (restaurant) => {
        this.setState({ Restaurants: [restaurant] });
    }

    accept = (e) => {
        e.preventDefault()
        let restaurant = this.state.Restaurants.pop();
        this.setState({ Restaurants: [] });
        this.setState({ showRes: false });
        this.rateRestaurant(true, restaurant.id);
        alert("Have a nice meal! Don't forget to rate your experience afterward for even better recommendations!");
    }

    reject = (e) => {
        e.preventDefault()
        let restaurant = this.state.Restaurants.pop();
        this.handleSubmit(e);   // Get new restaurant
        this.rateRestaurant(false, restaurant.id);
    }
    
    rateRestaurant = (rating, restaurantID) => {
        return fetch("/rate_suggestion", {
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
        }).then(response => response.json())
        .then(response => response.result);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/restaurants", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json"
            },
            body: JSON.stringify(
                getCookie("Username") + "\n" +
                this.state.q1 + "\n" +
                this.state.q2 + "\n" +
                this.state.q3
            )
        }).then(response => response.json())
        .then(response => this.setRestaurant(response.result));

        this.setState({ showRes: true });
    }

    render() {
        return (
            <div id="Quiz">
                <h1>Find restaurants near you</h1>
                <form onSubmit={this.handleSubmit}>
                    <label id="q1">
                        1. What are you in the mood for?
                        {/* TODO Allow multiple boxes to be checked */}
                        <select value={this.state.q1.value} required onChange={this.handleChange} name="q1">
                            <option value="Bar & Grill">Bar & Grill</option>
                            <option value="Sandwiches">Sandwiches</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Steakhouse">Steakhouse</option>
                            <option value="Fine Dining">Fine Dining</option>
                            <option value="Barbeque">Barbeque</option>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="South American">Mexican</option>
                            <option value="Italian">Italian</option>
                            <option value="Eastern European">Eastern European</option>
                            <option value="Mediterranean">Mediterranean</option>
                            <option value="Middle Eastern">Middle Eastern</option>
                            <option value="Indian">Indian</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Southeast Asian">Southeast Asian</option>
                        </select>
                    </label>
                    <br />
                    <label id="q2">
                        2. How much are you willing to spend?&emsp;&emsp;
                        <select value={this.state.q2.value} required onChange={this.handleChange} name="q2">
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                            <option value="$$$$">$$$$</option>
                        </select>
                    </label>
                    <br />
                    <label id="q3">
                        3. Maxmimum Distance (mi.)&emsp;
                        <input type="number" defaultValue="1" min="1" value={this.state.q2.value} name="q3"
                                required onChange={this.handleChange}>
                        </input>
                    </label>
                    <br />
                    <br></br>
                    <input type="submit" value="Submit" className="primary-button" />
                    <br />
                    <br></br>
                </form>
                { this.state.showRes ? 
                        //dynamic list element that is instantiated from state.Restaruants
                        this.state.Restaurants.map((Rest) => {
                            return (
                                <div className="Rest">
                                    <Restaurant id={Rest.id}
                                        name={Rest.Name}
                                        distance={Rest.Distance}
                                        price={Rest.Price}
                                        rating={Rest.Rating}
                                        accept={this.accept.bind(this)}
                                        reject={this.reject.bind(this)}>
                                    </Restaurant>
                                    <br></br>
                                </div>
                            )
                        }): null}
            </div>
        );
    }
}


export default FindQuizContainer;
