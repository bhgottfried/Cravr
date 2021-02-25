"""Utilities to create database connections and execute queries"""

from flaskext.mysql import MySQL
from pymysql.err import OperationalError

class DBConnection:
    mysql = None
    connections = []

    def __init__(self):
        pass

    @classmethod
    def setup(cls, app, **kwargs):
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
        if not cls.connections:
            try:
                return cls.mysql.connect()
            except (AttributeError, OperationalError):
                print("Couldn't get connection!")
                return None
        else:
            return cls.connections.pop()

    @classmethod
    def return_connection(cls, conn):
        cls.connections.append(conn)

    def execute_query(self, query):
        # Get connection and cursor
        conn = self.get_connection()
        cursor = conn.cursor()
        # Execute query and commit (for write operations)
        cursor.execute(query)
        result = cursor.fetchone()
        conn.commit()
        # Give the connection back to connection pool
        self.return_connection(conn)
        return result
