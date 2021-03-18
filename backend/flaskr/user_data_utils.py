"""Utilities to create new users and authenticate existing users"""

import json
from backend.flaskr.database_utils import DBConnection


# Help pls Eli :(
def read_user_data(username):
    """
    Retrieve the user's User object with model and review data from the database and return it
    :param username: Username entered on the registration screen
    :return: Dictionary with list of restaurants to review and model if username exists in the DB
             Otherwise, return None
    """
    # Get database instance
    db_conn = DBConnection()

    if db_conn == "some condition that will fail":
        return {
            "reviews": [],
            "model": None
        }

    result = db_conn.execute_query("SELECT data FROM user_profiles WHERE username = '{}'"
                                   .format(username))
    if result == -1 or result is None:
        return None
    return result[0]

# Help pls Eli :(
def write_user_data(username, data):
    """
    Create or modify a user's User object in the database
    :param username: Username entered on the registration screen
    :param data: User object to add or replace for username
    :return: None
    """
    # Get database instance
    db_conn = DBConnection()

    # Check if user exists in user profiles
    num_results = db_conn.execute_query("SELECT COUNT(*) FROM user_profiles WHERE username = '{}'"
                                        .format(username))[0]
    if num_results == 1:
        print("Updating data for existing user!")
        print("UPDATE user_profiles SET data = '{}' WHERE username = '{}'"
              .format(json.dumps(data), username))
        db_conn.execute_query("UPDATE user_profiles SET data = '{}' WHERE username = '{}'"
                              .format(json.dumps(data), username))
    elif num_results == 0:
        print("Adding data for new user!")
        print("INSERT INTO user_profiles (username, data) VALUES ({}, '{}')"
              .format(username, json.dumps(data)))
        db_conn.execute_query("INSERT INTO user_profiles (username, data) VALUES ('{}', '{}')"
                              .format(username, json.dumps(data)))
    else:
        print("{} user profiles found for user {}. Expected 0 or 1.".format(num_results, username))
