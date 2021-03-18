"""Utilities to create new users and authenticate existing users"""

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

    print("TEMP " + str(username))

    return None


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

    print("TEMP " + str(username) + str(data) + str(db_conn))

    return None
