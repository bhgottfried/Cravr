"""Utilities to create database connections and execute queries"""

from flaskext.mysql import MySQL
from pymysql.err import OperationalError

class DBConnection:
    """
    Maintains an instance of MySQL and a connection pool with methods for getting/returning
    connections and executing queries. Connections are automatically returned to the connection
    pool after each query has been completed.
    """
    mysql = None
    connections = []

    def __init__(self):
        """
        Make an instance to execute queries.
        :return: None
        """

    @classmethod
    def setup(cls, app, **kwargs):
        """
        Initializes MySQL at the start of Flask app. Should be run once per app instance.
        :param app: Flask app instance
        :param kwargs: Allows for nonstandard MySQL parameters
        :return: None
        """
        # Initialize class variable mysql
        cls.mysql = MySQL()
        # Do a standard configuration
        app.config.from_pyfile("../db_config.py")
        # Modify configuration based on arguments
        for arg, value in kwargs.items():
            if arg == "socket":
                app.config["MYSQL_DATABASE_HOST"] = value[0]
                app.config["MYSQL_DATABASE_PORT"] = value[1]
            elif arg == "credentials":
                app.config["MYSQL_DATABASE_USER"] = value[0]
                app.config["MYSQL_DATABASE_PASSWORD"] = value[1]
            elif arg == "database":
                app.config["MYSQL_DATABASE_DB"] = value
            elif arg == "charset":
                app.config["MYSQL_DATABASE_CHARSET"] = value
        # Initialize app and make one connection
        cls.mysql.init_app(app)
        cls.return_connection(cls.get_connection())

    @classmethod
    def get_connection(cls):
        """
        Gets a connection from the pool. Creates a new connection if none are available.
        :return: Database connection object
        """
        if cls.connections:
            return cls.connections.pop()
        try:
            return cls.mysql.connect()
        except (AttributeError, OperationalError):
            print("Couldn't get connection!")
            return None

    @classmethod
    def return_connection(cls, conn):
        """
        Returns a database connection to the connection pool
        :param conn: Database connection object
        :return: None
        """
        cls.connections.append(conn)

    def execute_query(self, query):
        """
        Gets a connection, executes a query, and returns the connection.
        :param query: SQL query to be executed
        :return: First result of the query
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query)
        result = cursor.fetchone()
        conn.commit()
        self.return_connection(conn)
        return result
