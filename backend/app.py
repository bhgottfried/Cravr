from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello world!"}

@app.route('/login')
def login():
    userpass = request.json
    password = userpass.split(' ')
    #check if matches database
    return {'result': "Login page"}
