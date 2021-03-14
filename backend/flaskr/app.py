"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user, register_user
from backend.flaskr.database_utils import DBConnection
from backend.flaskr.recommender import Recommender

# Instantiate app
app = Flask(__name__)
CORS(app)

# Configure DB connection
DBConnection.setup(app)

# Instantiate the recommender to generate suggestions
recommender = Recommender()


@app.route('/login', methods=["POST"])
def login():
    """Attempt to login the user with the provided credentials"""
    user, password = request.json.split('\n')
    match = authenticate_user(user, password)
    return {'result': "/" if match else "/Login"}


@app.route('/register', methods=["POST"])
def register():
    """Attempt to create a new user entry in the authentication database"""
    user, password = request.json.split('\n')
    registration_success = register_user(user, password)
    return {'result': "/Login" if registration_success else "/Register"}


@app.route('/restaurants', methods=["POST"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    args = request.json.split('\n')
    user = args[0]
    search_params = {
        "food": args[1],
        "price": args[2],
        "distance": args[3],
        "location": (args[4], args[5])
    }

    print(user, search_params)
    return {
        "result": recommender.get_restaurant(user, search_params)
    }


@app.route('/rate_suggestion', methods=["POST"])
def rate_suggestion():
    """Apply the user's rating to their profile and the restaurant's"""
    args    = request.json.split('\n')
    user    = args[0]
    rating  = args[1]
    rest_id = args[2]

    print(user, rating, rest_id)

    # Send data to the user's model for training and cache the reviewed restaurant
    recommender.cache_restaurant(user, rest_id)

    return {'result': "TODO"}
