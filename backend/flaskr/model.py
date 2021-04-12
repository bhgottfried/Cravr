"""Recommendation model for user to get personalized suggestions"""

import json
from backend.flaskr.yelp_api_utils import YelpAPI

class RecommendationModel:
    """
    Recommendation model class for a user to get personalized suggestions
    """

    yelp = YelpAPI()

    def __init__(self, method, data):
        """
        THIS CONSTRUCTOR IS "PRIVATE" AND SHOULD NOT BE CALLED.
        Initialization logic is handled in static factory methods.
        Description of fields:
            num_requests = number of times this model has been used to generate a suggestion
            food_genres  = dict of floats for how much a user likes each key (1-10)
            importances  = dict of floats for which restaurant features are most important (1-10)
        """
        if method == "state":
            self.num_requests = data["num_requests"]
            self.food_genres = data["food_genres"]
            self.importances = data["importances"]

        elif method == "quiz":
            self.num_requests = 0

            self.food_genres = {
                "Bar & Grill": 5,
                "Sandwiches": 5,
                "Pizza": 5,
                "Fast Food": 5,
                "Breakfast": 5,
                "Steakhouse": 5,
                "Fine Dining": 5,
                "Sushi": 5,
                "Seafood": 5,
                "Barbeque": 5,
                "American": 5,
                "Mexican": 5,
                "South American": 5,
                "Italian": 5,
                "Eastern European": 5,
                "Mediterranean": 5,
                "Middle Eastern": 5,
                "Indian": 5,
                "Chinese": 5,
                "Japanese": 5,
                "Korean": 5,
                "Southeast Asian": 5
            }
            self.food_genres[data.pop("favorite")] = 10
            self.food_genres[data.pop("leastFavorite")] = 0

            self.importances = {k: 2 * int(v) for k,v in data.items()}

        else:
            raise ValueError("{} is not a valid method".format(method))
    
    @staticmethod
    def from_state(state):
        """
        Static factory method to create a RecommendationModel object from json from the database
        :param state: Model state JSON object as stored in the database
        :return: New RecommendationModel with the state taken from the JSON
        """
        return RecommendationModel("state", state)

    @staticmethod
    def from_quiz(quiz):
        """
        Static factory method to initialize the model weights according to the user's quiz answers
        :param quiz: Object containing the user's quiz answers
        :return: New RecommendationModel with initialized model weights
        """
        return RecommendationModel("quiz", quiz)
    
    def to_json(self):
        """
        Serialize fields to store in database
        :return: This object as a JSON
        """
        return json.dumps(self)

    def get_bestaurant(self, restaurants):
        """
        Portmanteau for get best restaurant according to the model parameters
        :param restaurants: List of restaurant objects to be evaluated
        :return: Optimal item in restaurants
        """
        return restaurants[0] # Yeet

    def train_model(self, review):
        """
        Update the model weights after processing a user review.
        :param review: Review object sent from the frontend
        :return: None
        """
        pass
