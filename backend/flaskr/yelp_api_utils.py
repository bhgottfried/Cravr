"""Utilities for requesting data from the Yelp API"""

import requests
from backend.config import YelpConfig

BASE_URL = "https://api.yelp.com/v3"
BUSINESS_SEARCH_URL = BASE_URL + "/businesses/search"
PHONE_SEARCH_URL = BASE_URL + "/businesses/search/phone"
TRANSACTION_SEARCH_URL = BASE_URL + "/transactions/{transaction_type}/search"
BUSINESS_DETAILS_URL = BASE_URL + "/businesses/{id}"
BUSINESS_MATCH_URL = BASE_URL + "/businesses/matches"
BUSINESS_REVIEWS_URL = BASE_URL + "/businesses/{id}/reviews"
AUTOCOMPLETE_URL = BASE_URL + "/autocomplete"
SEARCH_LIMIT = 5

class YelpAPI:
    """
    Makes calls to the Yelp API for searches and business information. Searches will require
    location parameters (city or latitude and longitude), and getting business data will require
    a business ID.
    """

    def __init__(self):
        """
        Makes an instance to execute API calls.
        :return: None
        """
        self.api_key = YelpConfig.YELP_API_KEY
        self.headers = {"Authorization": "Bearer {}".format(self.api_key)}

    def request(self, url, params=None):
        """
        Send a GET request to the Yelp API and return the response.
        :param url: Request URL
        :param params: Request parameters
        :return: JSON response
        """
        response = requests.get(url, headers=self.headers, params=params).json()
        return response

    def business_search(self, term, location, **kwargs):
        """
        Query the Yelp Search API.
        :param term: Search term
        :param location: Search location (latitude and longitude or city)
        :return: JSON search results
        """
        params = {
            "term": term.replace(" ", "+"),
            "limit": SEARCH_LIMIT,
            "open_now": True
        }
        # Handle location parameter
        if isinstance(location, tuple):
            params["latitude"] = str(location[0])
            params["longitude"] = str(location[1])
        elif isinstance(location, str):
            params["location"] = location.replace(" ", "+")
        else:
            print("Location must be entered as either a 2-tuple (lat, long) or a string")
            return None
        # Handle optional parameters
        if kwargs:
            for arg, value in kwargs.items():
                if arg == "radius":
                    try:
                        radius_in_meters = int(float(value) * 1609.34)
                        params["radius"] = radius_in_meters if radius_in_meters <= 40000 else 40000
                    except ValueError:
                        print("Radius must be convertible to float")
                        return None
                elif arg == "price":
                    if value.count("$") == len(value):
                        params["price"] = value.count("$")
                    else:
                        print("Price must be between $ and $$$$")
                        return None
                elif arg == "open_now":
                    params["open_now"] = value
        response = self.request(url=BUSINESS_SEARCH_URL, params=params)
        return response

    def business_details(self, business_id):
        """
        Query the Yelp API for business details.
        :param business_id: Business ID or alias
        :return: JSON query results
        """
        url = BUSINESS_DETAILS_URL.replace("{id}", business_id)
        response = self.request(url=url)
        return response

    def business_reviews(self, business_id):
        """
        Query the Yelp API for business reviews.
        :param business_id: Business ID or alias
        :return: JSON query results
        """
        url = BUSINESS_REVIEWS_URL.replace("{id}", business_id)
        response = self.request(url=url)
        return response
