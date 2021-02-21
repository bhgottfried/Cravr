from flaskext.mysql import MySQL
from pymysql.err import OperationalError

mysql = None

def get_db_connection(app, host="localhost", port=3306, user="root", pwd="ece49595bois!", db="authdb", charset="utf8"):
    """
    This function will get a connection for the MySQL server.
    :param app: Flask app instance
    :param host: Address of the MySQL server
    :param port: Port of the MySQL server
    :param user: User with which to access the server
    :param pwd: User's password
    :param db: Database to use
    :param charset: Character set of the database
    :return: Database connection
    """
    global mysql
    # Create MySQL instance if it doesn't already exist
    if mysql is None:
        mysql = MySQL()
        app.config["MYSQL_DATABASE_HOST"] = host
        app.config["MYSQL_DATABASE_PORT"] = port
        app.config["MYSQL_DATABASE_USER"] = user
        app.config["MYSQL_DATABASE_PASSWORD"] = pwd
        app.config["MYSQL_DATABASE_DB"] = db
        app.config["MYSQL_DATABASE_CHARSET"] = charset
        mysql.init_app(app)
    # Try to connect to the database
    try:
        conn = mysql.connect()
        return conn
    except (AttributeError, OperationalError):
        mysql = None
        return None

def close_db_connection():
    """
    This function gets rid of the MySQL instance if it exists.
    :return: None
    """
    global mysql
    mysql = None

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
