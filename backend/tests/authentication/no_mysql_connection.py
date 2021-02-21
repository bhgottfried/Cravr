import unittest
from flask import Flask
from flask_cors import CORS
from backend.flaskr.database_utils import get_db_connection, close_db_connection

class NoMySQLConnection(unittest.TestCase):

    def test_wrong_port(self):
        # Make sure no database connection exists
        close_db_connection()
        # Create a Flask app instance
        app = Flask(__name__)
        CORS(app)
        # Try to establish a connection with the wrong port number
        conn = get_db_connection(app, port=9999)
        self.assertEqual(conn, None)

    def test_invalid_credentials(self):
        # Make sure no database connection exists
        close_db_connection()
        # Create a Flask app instance
        app = Flask(__name__)
        CORS(app)
        # Try to establish a connection with invalid login credentials
        conn = get_db_connection(app, user="baduser", pwd="badpass")
        self.assertEqual(conn, None)

    def test_invalid_database(self):
        # Make sure no database connection exists
        close_db_connection()
        # Create a Flask app instance
        app = Flask(__name__)
        CORS(app)
        # Try to establish a connection with an invalid database name
        conn = get_db_connection(app, db="baddatabase")
        self.assertEqual(conn, None)


if __name__ == '__main__':
    unittest.main()