from flask import Flask, request
from flask_cors import CORS
from backend.flaskr.authentication_utils import authenticate_user

app = Flask(__name__)
CORS(app)

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello world!"}

@app.route('/login', methods=["POST"])
def login():
    user, password = request.json.split('\n')
    match = authenticate_user(app, user, password)
    return {'result': "/Home" if match else "/"}

@app.route('/restaurants', methods=["GET"])
def restaurants():
    # Parse the user's restaurant request and get restaurants from Yelp
    return {'result': "TODO"}


@app.route('/rated', methods=["POST"])
def rated():
    # Apply the user's rating to their profile and the restaurant's
    return {'result': "TODO"}
