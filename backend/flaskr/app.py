"""Main backend routing file to respond to frontend API requests"""

from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user, register_user
from backend.flaskr.database_utils import DBConnection
from backend.flaskr.yelp_api_utils import YelpAPI
from backend.flaskr.restaurant_cache import RestaurantCache

# Instantiate app
app = Flask(__name__)
CORS(app)

# Configure DB connection
DBConnection.setup(app)

# Instantiate the YelpAPI
yelp = YelpAPI()

# Instantiate cache to prevent redundant suggestions
cache = RestaurantCache()


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
    food = args[1]
    price = args[2]
    dist = args[3]
    loc = (args[4], args[5])

    print(user, food, price, dist, loc)

    result = yelp.business_search(term=food, location=loc, radius=dist, price=price)
    if result["businesses"]:
        for restaurant in result["businesses"]:
            if not cache.is_cached(user, restaurant["id"]):
                cache.add_restaurant(user, restaurant["id"])
                return {"result": {
                    "id": restaurant["id"],
                    "Name": restaurant["name"],
                    "Location": restaurant["location"],
                    "Distance": round(restaurant["distance"] / 1609.34, ndigits=1),
                    "Price": restaurant["price"],
                    "Rating": restaurant["rating"]
                }}

    # We exhausted all the available restaurants or there were none at all
    print("Could not find any restaurants with the given parameters!")
    return {"result": {
        "id": "N/A",
        "Name": "No matches found!",
        "Distance": "I would walk 500",
        "Price": "$$$$",
        "Rating": 5
    }}


@app.route('/rate_suggestion', methods=["POST"])
def rate_suggestion():
    """Apply the user's rating to their profile and the restaurant's"""
    args    = request.json.split('\n')
    user    = args[0]
    rating  = args[1]
    rest_id = args[2]

    print(user, rating, rest_id)
    # Send data to the user's model for training

    return {'result': "TODO"}
