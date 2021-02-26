"""Utilities to create new users and authenticate existing users"""

import bcrypt
from pymysql.err import IntegrityError
from backend.flaskr.database_utils import DBConnection


def authenticate_user(username, password):
    """
    This function will get the user's salt and hashed password from the database.
    :param username: Username entered on the login screen
    :param password: Password entered on the login screen
    :return: True if credentials are valid, False otherwise
    """
    # Get database instance
    db_conn = DBConnection()
    # Fetch salt and hash from database
    try:
        db_salt, db_hash = db_conn.execute_query("SELECT salt, hash FROM auth WHERE username = '{}'"
                                                 .format(username))
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


def register_user(username, password):
    """
    This function will register a new user in the authentication database.
    :param username: Username entered on the registration screen
    :param password: Password entered on the registration screen
    :return: True if registration successful, False otherwise
    """
    # Get database instance
    db_conn = DBConnection()
    # Generate a random salt and hash the password
    salt = bcrypt.gensalt()
    hash_result = bcrypt.hashpw(password.encode("utf-8"), salt)
    # Create the new user if it doesn't already exist
    try:
        db_conn.execute_query(u"INSERT INTO auth (username, salt, hash) VALUE('{}', '{}', '{}')"
                              .format(username, salt.decode("utf-8"), hash_result.decode("utf-8")))
    except IntegrityError:
        print("User already exists!")
        return False
    print("User created successfully!")
    return True
