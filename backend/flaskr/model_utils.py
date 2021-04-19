"""Utility functions to be used for model creation, training, and utilization"""

from backend.flaskr.yelp_api_utils import YelpAPI

def get_categories(term):
    """
    Semantically parse a raw search term into Yelp categories
    :param term: search term the user entered to be semantically parsed
    :return: List of Yelp catefories that the search term best matches
    """
    # Query NYC with the search term in a 15 mile radius
    yelp = YelpAPI()
    result = yelp.business_search(
        term=term,
        location="manhattan, ny",
        radius=20,
        open_now=False
    )

    # This better get some hits...
    if "businesses" not in result:
        raise ValueError("No results found for {}".format(term))
    
    # Otherwise, get up to 10 restaurants from the list
    restaurants = result["businesses"]
    if len(restaurants) > 10:
        restaurants = restaurants[:10]
    
    # Parse the unique category aliases from the retaurants
    categories = list(set().union(*[
        set([
            category_dict["alias"] for category_dict in restaurant["categories"]
        ]) for restaurant in restaurants
    ]))

    return categories

def create_genre_dict(fav, least_fav):
    """
    Helper function to initialize a model food_genre field from a user quiz
    :param fav: Term for user's favorite food
    :param least_fav: Term for user's least favorite food
    :return: Dictionary with model weights assigned to initialized categories
    """
    genres = {}
    for category in get_categories(fav):
        genres[category] = 7
    for category in get_categories(least_fav):
        genres[category] = -7
    
    return genres


