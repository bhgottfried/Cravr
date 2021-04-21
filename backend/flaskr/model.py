"""Recommendation model for user to get personalized suggestions"""

import json
from backend.flaskr.yelp_api_utils import YelpAPI
from backend.flaskr.model_utils import create_genre_dict, get_categories_from_id, IMPORTANCE_KEYS
from backend.flaskr.entity_data_utils import read_restaurant_data

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
            num_reviews = number of reviews applied to this model
            food_genres  = dict of dicts:
                count      = number of interactions the user has had this category
                propensity = floats for how much the user likes each key [-10,10]
            importances  = dict of floats for which restaurant features are most important [0,10]
        """
        if method == "state":
            self.num_reviews = data["num_reviews"]
            self.food_genres = data["food_genres"]
            self.importances = data["importances"]

        elif method == "quiz":
            self.num_reviews = 0
            self.food_genres = create_genre_dict(data.pop("favorite"), data.pop("leastFavorite"))
            self.importances = {k: max(0, min(10, 2 * int(v) - 1)) for k,v in data.items()}

        elif method == "blank":
            self.num_reviews = 0
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
        return RecommendationModel("state", json.loads(state))

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
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True)

    def get_bestaurant(self, restaurants):
        """
        Portmanteau for get best restaurant according to the model parameters
        :param restaurants: List of restaurant objects to be evaluated
        :return: Optimal item in restaurants
        """
        def score(restaurant):
            """Compute a numerical score for how likely the user is to like this restaurant"""
            # Start with a multiple of the yelp rating
            result = 10 * restaurant["rating"]

            # Adjust if the user likes or dislikes this genre of restaurant
            if "categories" in restaurant:
                categories = [cat_dict["alias"] for cat_dict in restaurant["categories"]]
                for cat in categories:
                    if cat in self.food_genres:
                        result += self.food_genres[cat]["propensity"]

            # If we have Cravr review data, scale it based on the user's importances
            review_data = read_restaurant_data(restaurant["id"])
            if review_data:
                for k in IMPORTANCE_KEYS:
                    result += self.importances[k] * (review_data[k] - 2.5)

            # Penalize long distances by subtracting the squared distance
            dist = restaurant["distance"] / 1609.34
            result -= dist ** 2

            return result

        return max(
            [(restaurant, score(restaurant)) for restaurant in restaurants],
            key=lambda pair: pair[1]
        )[0]

    def train_review(self, rest_id, review):
        """
        Update the model weights after processing a user review.
        :param rest_id: Yelp restaurant ID string
        :param review: Review object sent from the frontend
        :return: None
        """
        self.num_reviews += 1
        is_liked = bool(review.pop("repeat"))

        # Adjust the user's importances based on which factors drove the sentiment of their review
        self.importances = {k: max(0, min(10,
            v + (1 if is_liked else -1) * (2 * review[k] - v) / (1 + self.num_reviews / 5)))
        for k,v in self.importances.items()}

        # Invert the magnitude of the review if the user would not eat here again
        if not is_liked:
            review = {k: 6 - v for k,v in review.items()}

        # Compute the review sentiment scaled based on the user's importances
        sentiment = 0
        for k in IMPORTANCE_KEYS:
            sentiment += self.importances[k] * review[k] * (1 if is_liked else -1)
        sentiment /= len(IMPORTANCE_KEYS) # Scale into [-10,10]

        # Adjust the food_genre weights based on this sentiment
        self.train_conversion(rest_id, sentiment)

    def train_conversion(self, rest_id, sentiment):
        """
        Update the food_genre weights for any conversion event
        :param rest_id: Yelp restaurant ID string
        :param sentiment: Positive or negative float [-10,10] for how (dis)liked the restaurant was
        """
        # Update the genre weights for the categories of the restaurant
        categories = get_categories_from_id(rest_id)
        for cat in categories:
            # Have we seen this category before?
            if cat in self.food_genres:
                # Update the count and use it as an attenuation factor
                self.food_genres[cat]["count"] += 1
                self.food_genres[cat]["propensity"] += \
                    sentiment / (1 + self.food_genres[cat]["count"] / 5)

                # Clamp the value to be within [-10,10]
                self.food_genres[cat]["propensity"] = max(
                    -10, min(10, self.food_genres[cat]["propensity"]
                ))
            # If not, create a new entry with this sentiment
            else:
                self.food_genres[cat] = {
                    "count": 1,
                    "propensity": sentiment
                }
