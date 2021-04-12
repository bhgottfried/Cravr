"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user, register_user
from backend.flaskr.database_utils import DBConnection
from backend.flaskr.yelp_api_utils import YelpAPI
from backend.flaskr.recommender import Recommender
from backend.flaskr.user import UserList

# Instantiate app
app = Flask(__name__)
CORS(app)


DBConnection.setup(app)         # Configure DB connection
users = UserList()              # Create mapping from usernames to User objects
yelp = YelpAPI()                # Initialize one YelpAPI for the app
recommender = Recommender(yelp) # Instantiate the recommender to generate suggestions


def _user(name):
    """
    Helper function to get the User object for a given name or
    add it to the UserList if it is not already in memory
    """
    if name not in users:
        users.add(name)
    return users[name]


@app.route('/cravr/login', methods=["POST"])
def login():
    """Attempt to login the user with the provided credentials"""
    name, password = request.json.split('\n')
    match = authenticate_user(name, password)
    if match and name not in users:
        users.add(name)

    return {'result': "/" if match else "/Login"}


@app.route('/cravr/register', methods=["POST"])
def register():
    """Attempt to create a new user entry in the authentication database"""
    user, password, quiz = request.json.split('\n')
    print(quiz)
    registration_success = register_user(user, password)
    return {'result': "/Login" if registration_success else "/Register"}


@app.route('/cravr/restaurants', methods=["POST"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    args = request.json.split('\n')
    name = args[0]
    search_params = {
        "food": args[1],
        "price": args[2],
        "distance": args[3],
        "location": (args[4], args[5])
    }

    print(name, search_params)

    return {"result": recommender.get_restaurant(_user(name), search_params)}


@app.route('/cravr/rate_suggestion', methods=["POST"])
def rate_suggestion():
    """Apply the user's rating to their profile and the restaurant's"""
    args     = request.json.split('\n')
    name     = args[0]
    rating   = args[1]
    rest_id  = args[2]

    user = _user(name)

    # Process rating
    if rating == "yummy":    # Add the accepted restaunt to the user's review list
        user.add_review(rest_id)
    elif rating == "yuck":  # Send the disliked restaurant to the user's model for training
        user.disliked(rest_id)
    elif rating == "maybe later": # User wants to go there but at a later time
        pass # Do nothing but still cache the restaurant

    # Cache the reviewed restaurant
    recommender.cache_restaurant(user, rest_id)

    return {'result': "TODO"}


@app.route('/cravr/get_reviews', methods=["POST"])
def get_reviews():
    """Get the restaurants that this user needs to review"""
    args     = request.json.split('\n')
    name     = args[0]

    # Return list of restaurants the user must review
    return {'result': _user(name).get_reviews(yelp)}


@app.route('/cravr/submit_review', methods=["POST"])
def submit_review():
    """Update the User object after a user reviews a restaurant they've visited"""
    args    = request.json.split('\n')
    name    = args[0]
    rest_id = args[1]
    review  = args[2]

    # Rate the restaurant
    _user(name).submit_review(rest_id, review)

    return {'result': "Success"}
