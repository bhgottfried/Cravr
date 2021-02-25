import React from 'react';
const restaurant = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <h3> Distance:{props.distance} mi</h3>
            <h5>Price:{props.price} Rating:{props.rating}/5</h5>
            <button onClick={props.accept}>Yummy!</button> <button onClick={props.delete}>Yuck</button>
        </div>
    )
}
export default restaurant;