"""Utilities to create database connections and execute queries"""

from flaskext.mysql import MySQL
from pymysql.err import OperationalError


def get_db_connection(app,
                      socket=("localhost", 3306),
                      credentials=("root", "ece49595bois!"),
                      database="authdb",
                      init=False
                      ):
    """
    This function will get a connection for the MySQL server.
    :param app: Flask app instance
    :param socket: Hostname and port of the MySQL server
    :param user: User with which to access the server
    :param pwd: User's password
    :param database: Database to use
    :return: Database connection
    """
    # Create MySQL instance if it doesn't already exist
    mysql = MySQL()
    app.config["MYSQL_DATABASE_HOST"] = socket[0]
    app.config["MYSQL_DATABASE_PORT"] = socket[1]
    app.config["MYSQL_DATABASE_USER"] = credentials[0]
    app.config["MYSQL_DATABASE_PASSWORD"] = credentials[1]
    app.config["MYSQL_DATABASE_DB"] = database
    app.config["MYSQL_DATABASE_CHARSET"] = "utf8"

    if init:
        mysql.init_app(app)
        init = False
        return None

    # Try to connect to the database
    try:
        return mysql.connect()
    except (AttributeError, OperationalError):
        return None

def execute_auth_query(app, query):
    """
    This function executes a query on the MySQL server.
    :param app: Flask app instance
    :param query: The query to be executed
    :return: The first result of the query
    """
    conn = get_db_connection(app, database="authdb")
    if conn is None:
        print("Could not connect to database!")
        return None
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchone()
    conn.commit()
    conn.close()
    return result
