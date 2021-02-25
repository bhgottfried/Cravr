"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user
from backend.flaskr.database_utils import DBConnection

# Instantiate app
app = Flask(__name__)
CORS(app)

# Initialize DB configuration
DBConnection.setup(app)

@app.route('/login', methods=["POST"])
def login():
    """Attempt to login the user with the provided credentials"""
    user, password = request.json.split('\n')
    match = authenticate_user(user, password)
    return {'result': "/Home" if match else "/"}


@app.route('/restaurants', methods=["GET"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    return {'result': "TODO"}


@app.route('/rated', methods=["POST"])
def rated():
    """Apply the user's rating to their profile and the restaurant's"""
    return {'result': "TODO"}
