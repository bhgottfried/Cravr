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
    name, password, quiz = request.json.split('\n')
    registration_success = register_user(name, password)

    if registration_success:
        users.add(name, quiz)
        return {'result': "/Login"}
    return {'result': "/Register"}


@app.route('/cravr/restaurants', methods=["POST"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    args = request.json.split('\n')
    name = args[0]
    search_params = {
        "food": args[1],
        "price": args[2],
        "distance": max(1, min(24, float(args[3]))),
        "location": (float(args[4]), float(args[5]))
    }

    return {"result": recommender.get_restaurant(_user(name), search_params)}


@app.route('/cravr/whats_good', methods=["POST"])
def whats_good():
    """Recommend a restaurant to the user based on their profile"""
    args = request.json.split('\n')
    user = _user(args[0])
    print(user.model.get_favorite_food())
    search_params = {
        "food": user.model.get_favorite_food(),
        "price": "1, 2, 3, 4", # The Yelp API interprets this as don't filter out any prices
        "distance": 5,
        "location": (float(args[1]), float(args[2]))
    }

    return {"result": recommender.get_restaurant(user, search_params)}


@app.route('/cravr/rate_suggestion', methods=["POST"])
def rate_suggestion():
    """Apply the user's rating to their profile and the restaurant's"""
    args     = request.json.split('\n')
    name     = args[0]
    rating   = args[1]
    rest_id  = args[2]

    if rest_id != "N/A":
        user = _user(name)

        # Process rating
        if rating == "yummy":
            # Add the accepted restaunt to the user's review list and apply the positive conversion
            user.add_review(rest_id)
            user.pique(rest_id, 3)
        elif rating == "yuck":
            # Apply the negative conversion to the user's model for training
            user.pique(rest_id, -1.5)
        elif rating == "maybe later": # User wants to go there but at a later time
            # Add slight positive weight for interest and still cache the restaurant
            user.pique(rest_id, 0.5)

        # Cache the reviewed restaurant
        recommender.cache_restaurant(user, rest_id)

    return {'result': "Success"}


@app.route('/cravr/get_reviews', methods=["POST"])
def get_reviews():
    """Get the restaurants that this user needs to review"""
    args = request.json.split('\n')
    name = args[0]

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
