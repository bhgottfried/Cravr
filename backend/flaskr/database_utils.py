"""Utilities to create database connections and execute queries"""

from flaskext.mysql import MySQL
from pymysql.err import OperationalError

MYSQL = None

def get_db_connection(app, socket=("localhost", 3306), user="root", pwd="ece49595bois!",
                      database="authdb"):
    """
    This function will get a connection for the MySQL server.
    :param app: Flask app instance
    :param socket: Hostname and port of the MySQL server
    :param user: User with which to access the server
    :param pwd: User's password
    :param database: Database to use
    :return: Database connection
    """
    global MYSQL
    # Create MySQL instance if it doesn't already exist
    if MYSQL is None:
        MYSQL = MySQL()
        app.config["MYSQL_DATABASE_HOST"] = socket[0]
        app.config["MYSQL_DATABASE_PORT"] = socket[1]
        app.config["MYSQL_DATABASE_USER"] = user
        app.config["MYSQL_DATABASE_PASSWORD"] = pwd
        app.config["MYSQL_DATABASE_DB"] = database
        app.config["MYSQL_DATABASE_CHARSET"] = "utf8"
        MYSQL.init_app(app)
    # Try to connect to the database
    try:
        conn = MYSQL.connect()
        return conn
    except (AttributeError, OperationalError):
        MYSQL = None
        return None

def close_db_connection():
    """
    This function gets rid of the MySQL instance if it exists.
    :return: None
    """
    global MYSQL
    MYSQL = None

def execute_query(conn, query):
    """
    This function executes a query on the MySQL server.
    :param conn: Database connection
    :param query: The query to be executed
    :return: The first result of the query
    """
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    return cursor.fetchone()
