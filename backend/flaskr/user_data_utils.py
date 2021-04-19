"""Utilities to create new users and authenticate existing users"""

from backend.flaskr.database_utils import DBConnection


def read_user_data(username):
    """
    Retrieve the user's User object with model and review data from the database and return it
    :param username: Username entered on the registration screen
    :return: Dictionary with list of restaurants to review and model if username exists in the DB
             Otherwise, return None
    """
    db_conn = DBConnection()
    result = db_conn.execute_query("SELECT data FROM user_profiles WHERE username = '{}'"
                                   .format(username))
    if result == -1 or result is None:
        return None
    return result[0]


def write_user_data(username, data):
    """
    Create or modify a user's User object in the database
    :param username: Username entered on the registration screen
    :param data: User object JSON to add or replace for username
    :return: None
    """
    db_conn = DBConnection()
    num_results = db_conn.execute_query("SELECT COUNT(*) FROM user_profiles WHERE username = '{}'"
                                        .format(username))[0]
    if num_results == 1:
        # Update data for existing user
        result = db_conn.execute_query("UPDATE user_profiles SET data = '{}' WHERE username = '{}'"
                                       .format(data, username))
    elif num_results == 0:
        # Add data for new user
        result = db_conn.execute_query("INSERT INTO user_profiles (username, data) VALUES "
                                       "('{}', '{}')".format(username, data))
    else:
        # Multiple instances of user found in profiles
        print("{} user profiles found for user {}. Expected 0 or 1.".format(num_results, username))
        return False

    # True if write successful, false otherwise
    if result == -1:
        return False
    return True
