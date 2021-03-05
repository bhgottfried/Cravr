"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user
from backend.flaskr.database_utils import get_db_connection

# Instantiate app
app = Flask(__name__)
CORS(app)

# Initialize DB configurations
get_db_connection(app, init=True)


@app.route('/login', methods=["POST"])
def login():
    """Attempt to login the user with the provided credentials"""
    user, password = request.json.split('\n')
    match = authenticate_user(app, user, password)
    return {'result': "/" if match else "/Login"}


@app.route('/register', methods=["POST"])
def register():
    """Attempt to create a new user entry in the login database"""
    return {'result': True}


@app.route('/restaurants', methods=["POST"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    args  = request.json.split('\n')
    user  = args[0]
    food  = args[1]
    price = args[2]
    dist  = args[3]

    print(user, food, price, dist)
    # TODO get restaurants from Yelp accessor class

    return {'result': {     # Example restaurant to return
        'id': 1,
        'Name': 'Disney World',
        'Distance': 1,
        'Price': "$$",
        'Rating': 3
    }}


@app.route('/rate_suggestion', methods=["POST"])
def rate_suggestion():
    """Apply the user's rating to their profile and the restaurant's"""
    args    = request.json.split('\n')
    user    = args[0]
    rating  = args[1]
    rest_id = args[2]

    print(user, rating, rest_id)
    # TODO send data to the user's model for training

    return {'result': "TODO"}
