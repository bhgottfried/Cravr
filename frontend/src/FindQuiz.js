import React from 'react';
import RestaurantContainer from './Restaurant.js';


class FindQuizContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = { q1: '',
                       q2: '',
                       q3: '',
                       q4: '' 
                    };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // TODO send to backend

        return (
            <div>
                <h1>Yeet</h1>
                <RestaurantContainer></RestaurantContainer>
            </div>
        )
    }

    render() {
        return (
            <div id="Quiz">
                <h1>Find restaurants near you</h1>
                <form onSubmit={this.handleSubmit}>
                    <label id="Question 1">
                        1. What are you in the mood for?
                        {/* TODO Allow multiple boxes to be checked */}
                        <select value={this.state.q1.value} onChange={this.handleChange}>
                            <option value="American">American</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Asian">Asian</option>
                            <option value="Italian">Italian</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Subs">Subs</option>
                            <option value="Fast Food">Fast Food</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 3">
                        3. How much would you like to spend?
                        <select value={this.state.q3.value} onChange={this.handleChange}>
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 4">
                        4. How far away can you go? (mi.)
                        <input type="text" pattern="[0-9]*"value={this.state.q4.value} onChange={this.handleChange}></input>
                    </label>
                    <br />
                    <br></br>
                    <input type="submit" value="Submit" className="primary-button" />
                    {/* TODO this needs to populate and render restaurant container object on submit */}
                </form>
            </div>
        );
    }
}


export default FindQuizContainer;
