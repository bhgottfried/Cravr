import pytest
from flask import Flask
from flask_cors import CORS
from backend.flaskr.database_utils import DBConnection


def test_wrong_socket():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with the wrong socket
    DBConnection.setup(app, socket=("localhost", 9999))
    conn = DBConnection().connections[0]
    assert conn is None

def test_invalid_credentials():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with invalid login credentials
    DBConnection.setup(app, credentials=("baduser", "badpass"))
    conn = DBConnection().connections[0]
    assert conn is None

def test_invalid_database():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with an invalid database name
    DBConnection.setup(app, database="baddatabase")
    conn = DBConnection().connections[0]
    assert conn is None


if __name__ == "__main__":
    pytest.main()
