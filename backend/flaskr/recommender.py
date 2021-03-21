"""Class to generate restaurant recommendations for a user"""

from backend.flaskr.restaurant_cache import RestaurantCache

class Recommender:
    """
    Class to generate restaurant recommendations for a user from the Yelp API
    """

    def __init__(self, yelp, cache_timeout=86400):
        """
        Initializes restaurant cache and Yelp API to get suggestions and
        maintain which restaurants have been recently rated.
        :param cache_timeout: Number of seconds to maintain stale restaurnt entries in cache
        :return: None
        """
        self.yelp = yelp
        self.cache = RestaurantCache(cache_timeout)

    def get_restaurant(self, user, search_params):
        """
        Suggest a restaurant to the user based on their search criteria
        :param user: User's for which we're suggesting a restaurant
        :param search_params: Dictionary of parameters used in Yelp search
        :return: Restaurant object
        """
        food = search_params["food"]
        location = search_params["location"]
        distance = search_params["distance"]
        price = search_params["price"]
        open_now = True
        if "open_now" in search_params.keys():
            open_now = search_params["open_now"]

        result = self.yelp.business_search(term=food, location=location, distance=distance,
                                           price=price, open_now=open_now)

        if "businesses" in result:
            for restaurant in result["businesses"]:
                if not self.cache.is_cached(user.name, restaurant["id"]):
                    return {
                        "id": restaurant["id"],
                        "Name": restaurant["name"],
                        "Location": restaurant["location"],
                        "Distance": round(restaurant["distance"] / 1609.34, ndigits=1),
                        "Price": restaurant["price"],
                        "Rating": restaurant["rating"]
                    }

        # We exhausted all the available restaurants or there were none at all
        print("Could not find any restaurants with the given parameters!")
        return {
            "id": "N/A",
            "Name": "No matches found!",
            "Location": ('0', '0'),
            "Distance": "I would walk 500",
            "Price": "$$$$",
            "Rating": 5
        }

    def cache_restaurant(self, user, restaurant_id):
        """
        Cache a restaurant that the user has recently rated so they don't receive it again
        :param user: User that just rated this restaurant
        :param restaurant_id: Yelp restaurant ID that was just rated
        :return: None
        """
        self.cache.add_restaurant(user.name, restaurant_id)
