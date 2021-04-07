"""Recommendation model for user to get personalized suggestions"""

class RecommendationModel:
    """
    Recommendation model class for a user to get personalized suggestions
    """

    def __init__(self):
        """
        Default constructor to create object.
        More complex logic is handled in static factory methods.
        """
        self.model = None

    @staticmethod
    def from_quiz(quiz):
        """
        Static factory method to initialize the model weights according to the user's quiz answers
        :param quiz: Object containing the user's quiz answers
        :return: New RecommendationModel with initialized model weights
        """
        return RecommendationModel()
    
    @staticmethod
    def from_state(json):
        """
        Static factory method to create a RecommendationModel object from json from the database
        :param json: Model state JSON object as stored in the database
        :return: New RecommendationModel with the state taken from the JSON
        """
        return RecommendationModel()

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
