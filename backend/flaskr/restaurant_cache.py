"""Class to maintain which suggestions have been recently given to each user"""

from time import time

class RestaurantCache(object):
    """
    Class to maintain a mapping of users to a collection of which restaurants
    they have been assigned within a set timeout limit.
    """

    def __init__(self, timeout=86400):
        """
        Initializes hashtable. Should be instantiated once at beginning of app.
        :param timeout: Number of seconds to keep restaurant ID in table
        :return: None
        """
        self.timeout = timeout
        self.table = {}

    def is_cached(self, user, restaurant_id):
        """
        Check if this restaurant ID is cached for this user
        :param user: User's cache to check
        :param restaurant_id: Yelp ID
        :return: Bool for if the entry exists and is not stale
        """
        self.clean(user)
        return user in self.table and restaurant_id in self.table[user]

    def add_restaurant(self, user, restaurant_id):
        """
        Create or update new entry for the restaurant ID for this user
        :param user: User's cache to clean
        :param restaurant_id: Yelp ID
        :return: None
        """
        if user not in self.table:
            self.table[user] = {}
        self.table[user][restaurant_id] = time()

    def clean(self, user):
        """
        Remove stale entries in the table for a given user
        :param user: User's cache to clean
        :return: None
        """
        if user in self.table:
            # Get user's cache that maps restaurant ID to when it was inserted
            cache = self.table[user]
            now = time()
            for restaurant_id, insertion_time in cache.items():
                if now - insertion_time > self.timeout:
                    cache.pop(restaurant_id)
