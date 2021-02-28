import React from 'react';
import RestaurantContainer from './Restaurant.js';


export function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}


class FindQuizContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            q1: '',
            q2: '',
            q3: '',
            showRes: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/prefrences", {
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
            });//Restaurant data handling should be handled in Restaurant.js This should only send the quiz answers to the backend for storage

        this.setState({ showRes: 1 });
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
                            {/* TODO Add more options */}
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
                        2. How much would you like to spend?
                        <select value={this.state.q2.value} required onChange={this.handleChange}>
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                        </select>
                    </label>
                    <br />
                    <label id="Question 4">
                        3. Maxmimum Distance (mi.)
                        <input type="number" defaultValue="1" min="1" value={this.state.q2.value} required onChange={this.handleChange}></input>
                    </label>
                    <br />
                    <br></br>
                    <input type="submit" value="Submit" className="primary-button" />
                </form>
                { this.state.showRes ? <RestaurantContainer></RestaurantContainer> : null}
            </div>
        );
    }
}


export default FindQuizContainer;
