"""Utilities to create new users and authenticate existing users"""

import bcrypt
from pymysql.err import IntegrityError
from backend.flaskr.database_utils import execute_auth_query


def authenticate_user(app, username, password):
    """
    This function will get the user's salt and hashed password from the database.
    :param app: Flask app instance
    :param username: Username entered on the login screen
    :param password: Password entered on the login screen
    :return: True if credentials are valid, False otherwise
    """
    # Fetch salt and hash from database
    try:
        db_salt = execute_auth_query(app, "SELECT salt FROM auth WHERE username = '{}'"
                                     .format(username))[0]
        db_hash = execute_auth_query(app, "SELECT hash FROM auth WHERE username = '{}'"
                                     .format(username))[0]
    except TypeError:
        print("User could not be found!")
        return False

    # Hash password and check if it matches the stored hash
    hash_result = bcrypt.hashpw(password.encode("utf-8"), db_salt)
    print("User's hash:   {}\nDatabase hash: {}".format(hash_result, db_hash))
    if hash_result == db_hash:
        print("Authentication successful!")
        return True
    print("Authentication failed!")
    return False


def register_user(app, username, password):
    """
    This function will register a new user in the authentication database.
    :param app: Flask app instance
    :param username: Username entered on the registration screen
    :param password: Password entered on the registration screen
    :return: True if registration successful, False otherwise
    """
    # Generate a random salt and hash the password
    salt = bcrypt.gensalt()
    hash_result = bcrypt.hashpw(password.encode("utf-8"), salt)
    # Create the new user if it doesn't already exist
    try:
        execute_auth_query(app, u"INSERT INTO auth (username, salt, hash) VALUE('{}', '{}', '{}')"
                           .format(username, salt.decode("utf-8"), hash_result.decode("utf-8")))
    except IntegrityError:
        print("User already exists!")
        return False
    print("User created successfully!")
    return True
