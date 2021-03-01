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
    return {'result': "TODO"}


@app.route('/preferences', methods=["POST"])
def preferences():
    """Change the users prefrences in the database"""
    return {'result': "TODO"}


@app.route('/rated', methods=["POST"])
def rated():
    """Apply the user's rating to their profile and the restaurant's"""
    return {'result': "TODO"}
