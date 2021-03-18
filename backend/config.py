"""App configuration parameters"""

class DatabaseConfig:  # pylint: disable=too-few-public-methods
    """Parameters for configuring Flask app"""
    # Database
    MYSQL_DATABASE_HOST = "localhost"
    MYSQL_DATABASE_PORT = 3306
    MYSQL_DATABASE_USER = "root"
    MYSQL_DATABASE_PASSWORD = "ece49595bois!"
    MYSQL_DATABASE_DB = "cravr"
    MYSQL_DATABASE_CHARSET = "utf8"

class YelpConfig:  # pylint: disable=too-few-public-methods
    """Parameters for connecting to Yelp API"""
    YELP_API_KEY = "zuKANByramNYkaJ280Kd7DzB6sX-kz_GnaHhTvZ6FUO_u8Yifv7dy8ffdW8ztX2" \
                   "mrbe3StRfPa_6M5ZeuhdD78P6KmsbbYbBPxfWFPfSNQnZyAMd8U2jBOqBdaA_YHYx"
