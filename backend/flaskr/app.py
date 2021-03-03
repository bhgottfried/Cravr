"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user, register_user
from backend.flaskr.database_utils import DBConnection
from backend.flaskr.yelp_api_utils import YelpAPI

# Instantiate app
app = Flask(__name__)
CORS(app)

# Configure DB connection
DBConnection.setup(app)

@app.route('/login', methods=["POST"])
def login():
    """Attempt to login the user with the provided credentials"""
    user, password = request.json.split('\n')
    match = authenticate_user(user, password)
    return {'result': "/Home" if match else "/"}


@app.route('/register', methods=["POST"])
def register():
    """Attempt to create a new user entry in the authentication database"""
    user, password = request.json.split('\n')
    registration_success = register_user(user, password)
    return {'result': "/Login" if registration_success else "/Register"}


@app.route('/restaurants', methods=["GET"])
def restaurants():
    """Parse the user's restaurant request and get restaurants from Yelp"""
    return {'result': "TODO"}


@app.route('/rated', methods=["POST"])
def rated():
    """Apply the user's rating to their profile and the restaurant's"""
    return {'result': "TODO"}


if __name__ == "__main__":
    # Search Yelp API
    yelp = YelpAPI()
    # result = yelp.search(term="sushi", location="lafayette, in")
    result = yelp.search(term="sushi", location=(40.4167,-86.8753))
    print(result)
    for item in result["businesses"]:
        print(item["name"])
