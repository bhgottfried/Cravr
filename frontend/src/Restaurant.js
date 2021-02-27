import React from 'react';


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
        this.addRestaurant = this.addRestaurant.bind(this);
        this.bindButtons = this.bindButtons.bind(this);
    }

    state = {
        Restaurants: [
            // Start with empty list and add restaurants after
            // the quiz is filled out and the backend returns suggestions
            
            // { id: 1, Name: 'Disney World', Distance: 1, Price: "$$", Rating: 3 },
            // { id: 2, Name: "Disney World2", Distance: 12, Price: "$$", Rating: 4 },
            // { id: 3, Name: "Disney World3", Distance: 4, Price: "$$", Rating: 4 }
        ]
    }

    addRestaurant = (restaurant) => {
        this.state.Restaurants.push(restaurant);
    }

    bindButtons = () => {
        this.state.Restaurants.map((rest, index) => {
            rest.accept = this.accept.bind(this, index);
            rest.delete = this.delete.bind(this, index);
        })
    }

    accept = (index, e) => {
        e.preventDefaults();
        alert("accept is still called!")    // TEMP
        //runs when yummy button clicked
        //TODO: What should this button do?
    }

    delete = (index, e) => {
        e.preventDefaults();
        alert("delete is still called!")    // TEMP
        //runs when yuck button clicked and deletes entry in state
        const restaurants = Object.assign([], this.state.Restaurants);
        restaurants.splice(index, 1);
        this.setState({ Restaurants: restaurants })
    }

    render() {
        return (
            <div>
                <ul id="ResList">
                    {
                        //dynamic list element that is instantiated from state.Restaruants
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
