"""Recommendation model for user to get personalized suggestions"""

import json
from backend.flaskr.yelp_api_utils import YelpAPI
from backend.flaskr.model_utils import create_genre_dict

IMPORTANCE_KEYS = ["food", "service", "atmosphere", "value"]

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
            food_genres  = dict of floats for how much a user likes each key [-10,10]
            importances  = dict of floats for which restaurant features are most important {1-10}
        """
        if method == "state":
            self.num_requests = data["num_requests"]
            self.food_genres = data["food_genres"]
            self.importances = data["importances"]

        elif method == "quiz":
            self.num_requests = 0
            self.food_genres = create_genre_dict(data.pop("favorite"), data.pop("leastFavorite"))
            self.importances = {k: 2 * int(v) for k,v in data.items()}

        elif method == "blank":
            self.num_requests = 0
            self.food_genres = {}
            self.importances = {
                k: 5 for k in IMPORTANCE_KEYS
            }

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

    @staticmethod
    def from_blank():
        """
        Static factory method to initialize default model weights used for testing only
        :return: New RecommendationModel with default initialized model weights
        """
        return RecommendationModel("blank", None)

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
        print(self.num_requests) # Temp Pylint
        return restaurants[0] # Yeet

    def train_model(self, review):
        """
        Update the model weights after processing a user review.
        :param review: Review object sent from the frontend
        :return: None
        """
        print(self.num_requests, review) # Temp Pylint
