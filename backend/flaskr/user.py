"""Classes to store semi-permanent data associated with user"""

import atexit
import json
from backend.flaskr.model import RecommendationModel
from backend.flaskr.model_utils import IMPORTANCE_KEYS
from backend.flaskr.entity_data_utils import read_user_data, write_user_data, write_restaurant_data

class User:
    """
    Container class for a user's data (e.g. restaurants to review and the user's model)
    """

    def __init__(self, name, quiz=None):
        """
        Object to contain list of restaurants that need to be reviewed and user model
        :param name: User's name or email address
        :param quiz: If the quiz exists, create a new model using it as an initialization.
                     Otherwise, try to read the model state from the database.
        :return: New User object
        """
        self.name = name

        if quiz:
            self.is_dirty = True
            self.reviews = []
            quiz = json.loads(quiz)
            for k in IMPORTANCE_KEYS:
                quiz[k] = max(0, min(5, int(quiz[k])))
            self.model = RecommendationModel.from_quiz(quiz)
        else:
            self.is_dirty = False
            user_dict = read_user_data(name)
            if user_dict:
                self.reviews = user_dict["reviews"]
                self.model = RecommendationModel.from_state(user_dict["model"])
            else:
                self.reviews = []
                self.model = RecommendationModel.from_blank()

    def add_review(self, rest_id):
        """
        Add restaurant ID that needs to be reviewed
        :param rest_id: Restaurant ID that needs to be reviewed
        :return: None
        """
        if rest_id not in self.reviews:
            self.is_dirty = True
            self.reviews.append(rest_id)

    def get_reviews(self, yelp):
        """
        Return list of restaurant objects that need to be reviewed
        :param yelp: YelpAPI object to map restaurant IDs to full restaurant objects
        :return: List of restaurant objects
        """
        if self.reviews != []:
            return [ {
                "restaurant": yelp.business_details(rest_id),
                "review": {k: 5 for k in IMPORTANCE_KEYS + ["repeat"]} # Frontend default values
            } for rest_id in self.reviews]
        return [{"None":"1"}]

    def submit_review(self, rest_id, review):
        """
        After the user reviews a restaurant Cravr recommended,
        remove it from the list and update the model
        :param rest_id: Restaurand ID for what was reviewed
        :param review: Review object based on quiz from the front end
        :return: List of restaurant objects
        """
        if rest_id not in self.reviews:
            raise ValueError("Attempted to review restaurant not in the user's review list")

        self.is_dirty = True
        self.reviews.remove(rest_id)

        review = {k: max(1, min(5, int(v))) for k,v in json.loads(review).items()}
        self.handle_review(rest_id, review)

    def handle_review(self, rest_id, review):
        """
        Train the User's model based on the review for this restaurant
        :param rest_id: Restaurant ID that was rated
        :return: None
        """
        self.is_dirty = True
        self.model.train_review(rest_id, review)
        write_restaurant_data(rest_id, review)

    def pique(self, rest_id, sentiment):
        """
        Adjust model weights based on user interest to (en/dis)courage similar restaurants
        :param rest_id: Restaurant ID that was rated
        :param sentiment: Positive or negative float for the conversion event
        :return: None
        """
        self.is_dirty = True
        self.model.train_conversion(rest_id, sentiment)

    def to_json(self):
        """
        Serialize data fields to store in database (need to skip dirty bit so we can't just dump)
        :return: This object as a JSON
        """
        return {
            "reviews": self.reviews,
            "model": self.model.to_json()
        }


class UserList:
    """
    Class to maintain collection of users with data actively in memory
    """

    def __init__(self, is_prod=True):
        """
        Create an empty table of Users in memory. We add user data to memory as necessary
        :return: None
        """
        self.users = {}

        def cleanup():
            """Write the modified user data to the database when the app is shutting down."""
            for name, user in self.users.items():
                if user.is_dirty:
                    user.is_dirty = False
                    write_user_data(name, user.to_json())
        if is_prod:
            atexit.register(cleanup)

    def add(self, name, quiz=None):
        """
        Add User object to the list for the given name if it is not already in it
        :param name: Username entered on the registration screen
        :return: None
        """
        if name not in self.users:
            self.users[name] = User(name, quiz)
        else:
            raise ValueError("{} already exists in the user list!".format(name))

    def __getitem__(self, name):
        """
        Get the User object from the list
        :param name: Username entered on the registration screen
        :return: User object with associated data
        """
        return self.users[name]

    def __contains__(self, name):
        """
        Check if name is already in the table of users
        :param name: Username entered on the registration screen
        :return: Bool for if the user already exists in the list
        """
        return name in self.users
