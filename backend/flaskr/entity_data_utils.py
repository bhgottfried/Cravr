"""Utility functions for accessing databases for user and restaurant profiles"""

from backend.flaskr.database_utils import DBConnection
from backend.flaskr.model import IMPORTANCE_KEYS

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


def read_restaurant_data(rest_id):
    """
    Retrieve the restaurants's review data from the database and return it
    :param rest_id: Yelp restaurant ID for the business
    :return: Dictionary with number of reviews and their average if rest_id exists in the DB
             Otherwise, return None
    """
    db_conn = DBConnection()
    result = db_conn.execute_query("SELECT data FROM rest_profiles WHERE rest_id = '{}'"
                                   .format(rest_id))
    if result == -1 or result is None:
        return None
    return result[0]


def write_restaurant_data(rest_id, data):
    """
    Create or update a restaurant's average reviews in the database
    :param rest_id: Username entered on the registration screen
    :param data: New review object for the restaurant
    :return: None
    """
    db_conn = DBConnection()
    num_results = db_conn.execute_query("SELECT COUNT(*) FROM rest_profiles WHERE rest_id = '{}'"
                                        .format(rest_id))[0]
    if num_results == 1:
        # Get the existing reviews for this restaurant
        reviews = db_conn.execute_query("SELECT data FROM rest_profiles WHERE rest_id = '{}'"
                                   .format(rest_id))

        # Recompute averages for each field with the new review data
        prev_num_reviews = reviews["num_reviews"]
        reviews = {
            k: (reviews[k] * prev_num_reviews + data[k]) / (prev_num_reviews + 1)
            for k in IMPORTANCE_KEYS
        }
        reviews["num_reviews"] = prev_num_reviews + 1

        # Update data for existing restaurant
        result = db_conn.execute_query("UPDATE rest_profiles SET data = '{}' WHERE rest_id = '{}'"
                                       .format(reviews, rest_id))
    elif num_results == 0:
        # Add data for new restaurant
        data["num_reviews"] = 1
        result = db_conn.execute_query("INSERT INTO rest_profiles (rest_id, data) VALUES "
                                       "('{}', '{}')".format(rest_id, data))
    else:
        # Multiple instances of user found in profiles
        print("{} user profiles found for user {}. Expected 0 or 1.".format(num_results, rest_id))
        return False

    # True if write successful, false otherwise
    if result == -1:
        return False
    return True
