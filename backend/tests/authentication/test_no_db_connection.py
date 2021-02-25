import pytest
from flask import Flask
from flask_cors import CORS
from backend.flaskr.database_utils import get_db_connection


def test_wrong_socket():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with the wrong socket
    conn = get_db_connection(app, socket=("localhost", 9999))
    assert conn is None

def test_invalid_credentials():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with invalid login credentials
    conn = get_db_connection(app, credentials=("baduser", "badpass"))
    assert conn is None

def test_invalid_database():
    # Create a Flask app instance
    app = Flask(__name__)
    CORS(app)
    # Try to establish a connection with an invalid database name
    conn = get_db_connection(app, database="baddatabase")
    assert conn is None


if __name__ == "__main__":
    pytest.main()
