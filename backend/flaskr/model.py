"""Recommendation model for user to get personalized suggestions"""

class RecommendationModel:
    """
    Recommendation model class for a user to get personalized suggestions
    """

    def __init__(self, quiz=None):
        """
        Initialize the model weights according to the user's initialization quiz answers
        :param quiz: Object containing the user's quiz answers
        :return: None
        """
        self.model = None

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
