from flaskext.mysql import MySQL

mysql = None

def get_db_cursor(app):
    """
    This function will get a connection and cursor for the MySQL server.
    :param app: Flask app instance
    :return: Connection and Cursor objects
    """
    global mysql
    # Create MySQL instance if it doesn't already exist
    if mysql is None:
        mysql = MySQL()
        app.config["MYSQL_DATABASE_HOST"] = "localhost"
        app.config["MYSQL_DATABASE_PORT"] = 3306
        app.config["MYSQL_DATABASE_USER"] = "root"
        app.config["MYSQL_DATABASE_PASSWORD"] = "ece49595bois!"
        app.config["MYSQL_DATABASE_DB"] = "authdb"
        app.config["MYSQL_DATABASE_CHARSET"] = "utf8"
        mysql.init_app(app)
    # Connect to the database and return a cursor
    conn = mysql.connect()
    cursor = conn.cursor()
    return conn, cursor

def execute_query(app, query):
    """
    This function executes a query on the MySQL server.
    :param app: Flask app instance
    :param query: The query to be executed
    :return: The first result of the query
    """
    connection, cursor = get_db_cursor(app)
    cursor.execute(query)
    connection.commit()
    return cursor.fetchone()
