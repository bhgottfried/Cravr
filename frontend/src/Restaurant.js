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


class RestaurantContainer extends React.Component {
    //essentially scrollable list of restaurant 
    //dynamic list of restaurant elements
    constructor(props) {
        super(props);
        this.PopulateStates = this.PopulateStates.bind(this);
    }

    state = {
        Restaurants: [
            { id: 1, Name: 'Disney World', Distance: 1, Price: "$$", Rating: 3 },
            { id: 2, Name: "Disney World2", Distance: 12, Price: "$$", Rating: 4 },
            { id: 3, Name: "Disney World3", Distance: 4, Price: "$$", Rating: 4 }
        ]
    }

    accept = (index, e) => {
        //runs when yummy button clicked
        //TODO: add a restaurant to the list
        //TODO: get one from backend
    }

    delete = (index, e) => {
        //runs when yuck button clicked
        const restaurants = Object.assign([], this.state.Restaurants);
        restaurants.splice(index, 1);
        this.setState({ Restaurants: restaurants })
        //deletes entry in state
        //TODO relate this to backend and get new restaurant
    }

    PopulateStates() {
        //TODO add to Restaruants property in state above to dynamically populate the list
        //runs in constructor and finds restaurants from the backend

        fetch("/restaurants", {
            method: "GET",
            cache: "no-cache",
            headers: {
              "content_type": "application/json"
            },
            // TODO Send login credentials over SSL
            body: JSON.stringify(getCookie("Username"))
          }).then(response => response.json())
          .then(response => {
            //TODO read response data and set some states based on how many restaurants of data are sent
          });
    }

    render() {
        return (    // TODO make request to backend to fetch list of restuarants from Yelp API
            <div>
                <ul id="ResList">
                    {
                        //dynamic list element that is insantiated from state.Restaruants
                        //TODO: doesn't render for some reason
                        this.state.Restaurants.map((Rest, index) => {
                            return (
                                <div className="Rest">
                                    <Restaurant  id={Rest.id}
                                        name={Rest.Name}
                                        distance={Rest.Distance}
                                        price={Rest.Price}
                                        rating={Rest.Rating}
                                        accept={this.accept.bind(this, index)}
                                        delete={this.delete.bind(this, index)}></Restaurant>
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