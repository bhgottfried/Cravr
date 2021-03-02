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
            <button onClick={props.accept}>Yummy!</button> <button onClick={props.delete}>Yuck</button>
        </div>
    )
}


class FindQuizContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            q1: '',
            q2: '',
            q3: '',
            showRes: false,
            Restaurants: [
                    // Start with empty list and add restaurants after the quiz is filled out and the backend returns suggestions
                    { id: 1, Name: 'Disney World', Distance: 1, Price: "$$", Rating: 3 }
                ]
        };
        this.addRestaurant = this.addRestaurant.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    addRestaurant = (restaurant) => {
        //adds restaurant to state
        let restaurants = Object.assign([], this.state.Restaurants);
        this.state.Restaurants.push(restaurants);
        this.setState({ Restaurants: restaurants }) 
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
                getCookie("Username") + "\n" +
                this.state.q1 + "\n" +
                this.state.q2 + "\n" +
                this.state.q3 + "\n" +
                name + "\n" +
                rating
            )
        }).then(response => {
            //TODO: not sure if this fully works
            //TODO: format response so that we can intrepret it into a restaurant element


            //use response to add restaurant state
            let restaurants = Object.assign([], this.state.Restaurants);
            restaurants.push(response);
            this.setState({ Restaurants: restaurants }) // must setState to update the actual render
        });
    }
    accept = (index, e) => {
        let restaurants = Object.assign([], this.state.Restaurants);
        let accepted = restaurants.splice(index, 1); // send this restaurant data to backend for feedback
        this.setState({ Restaurants: restaurants })
        //TODO: fetch a new restaurant from the backend to replace this element, also send data
        this.replaceRest(accepted.values(),1);
    }
    delete = (index, e) => {
        let restaurants = Object.assign([], this.state.Restaurants);
        let deleted = restaurants.splice(index, 1); // send this restaurant data to backend for feedback
        this.setState({ Restaurants: restaurants })
        //TODO: fetch a new restaurant from the backend to replace this element, also send data
        this.replaceRest(deleted.values(),0);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/preferences", {
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
            .then(response => {
                //TODO Add server response instead of this example
            }).then(this.addRestaurant({ id: 1, Name: 'Disney World', Distance: 1, Price: "$$", Rating: 3 }))

        this.setState({ showRes: true });
    }

    render() {
        return (
            <div id="Quiz">
                <h1>Find restaurants near you</h1>
                <form onSubmit={this.handleSubmit}>
                    <label id="Question 1">
                        1. What are you in the mood for?
                        {/* TODO Allow multiple boxes to be checked */}
                        <select value={this.state.q1.value} required onChange={this.handleChange}>
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
                    <label id="Question 3">
                        2. How much are you willing to spend?&emsp;&emsp;
                        <select value={this.state.q2.value} required onChange={this.handleChange}>
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                            <option value="$$$$">$$$$</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 4">
                        3. Maxmimum Distance (mi.)&emsp;
                        <input type="number" defaultValue="1" min="1" value={this.state.q2.value} required onChange={this.handleChange}></input>
                    </label>
                    <br />
                    <br></br>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
                { this.state.showRes ? 
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
                        }): null}
            </div>
        );
    }
}


export default FindQuizContainer;
