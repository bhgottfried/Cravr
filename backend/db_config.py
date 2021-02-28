"""Flask configuration"""

class Config:  # pylint: disable=too-few-public-methods
    """Parameters for configuring Flask app"""
    # Database
    MYSQL_DATABASE_HOST = "localhost"
    MYSQL_DATABASE_PORT = 3306
    MYSQL_DATABASE_USER = "root"
    MYSQL_DATABASE_PASSWORD = "ece49595bois!"
    MYSQL_DATABASE_DB = "authdb"
    MYSQL_DATABASE_CHARSET = "utf8"
