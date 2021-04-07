"""Classes to store semi-permanent data associated with user"""

from backend.flaskr.user_data_utils import read_user_data, write_user_data, get_quiz_answers
from backend.flaskr.model import RecommendationModel

class User:
    """
    Container class for a user's data (e.g. restaurants to review and the user's model)
    """

    def __init__(self, name):
        """
        Object to contain list of restaurants that need to be reviewed and user model
        :param cache_timeout: Number of seconds to maintain stale restaurnt entries in cache
        :return: None
        """
        self.name = name
        self.is_dirty = False
        user_dict = read_user_data(name)
        if user_dict:
            self.reviews = RecommendationModel.from_state(user_dict["reviews"])
            self.model = user_dict["model"]
        else:
            self.reviews = []
            self.model = RecommendationModel.from_quiz(get_quiz_answers(name))

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
                "review": {     # Frontend default values
                    "food": "5",
                    "service": "5",
                    "atmosphere": "5",
                    "overall": "5",
                    "repeat": "1"
                }
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
        self.handle_review(rest_id, review)

    def handle_review(self, rest_id, review):
        """
        Adjust model weights to based on the review for this restaurant
        :param rest_id: Restaurant ID that was rated
        :return: None
        """
        self.is_dirty = True
        print("TEMP: " + str(rest_id) + str(review))
        # This method is not yet implemented because we don't have a model
        # This should be refactored into a separate model class as well

    def disliked(self, rest_id):
        """
        Adjust model weights to discourage similar restaurants from being suggested
        :param rest_id: Restaurant ID that was disliked
        :return: None
        """
        self.is_dirty = True
        self.handle_review(rest_id, {"standard bad review object"})


class UserList:
    """
    Class to maintain collection of users with data actively in memory
    """

    def __init__(self, is_prod=True):
        """
        Create an empty table of Users in memory. We add user data to memory as necessary
        :param is_prod: Bool for testing without calling DB functions
        :return: None
        """
        self.users = {}
        self.is_prod = is_prod

    def add(self, name):
        """
        Add User object to the list for the given name if it is not already in it
        :param name: Username entered on the registration screen
        :return: None
        """
        if name not in self.users:
            self.users[name] = User(name)
        else:
            raise ValueError("{} already exists in the user list!".format(name))

    def __getitem__(self, name):
        """
        Get the User object from the list
        :param name: Username entered on the registration screen
        :return: User object with associated data
        """
        return self.users[name]

    def __del__(self):
        """
        Write the modified user data to the database when the app is shutting down.
        :return: None
        """
        if self.is_prod:
            for user in self.users:
                if user.is_dirty:
                    user.is_dirty = False
                    write_user_data(user.name, user)

    def __contains__(self, name):
        """
        Check if name is already in the table of users
        :param name: Username entered on the registration screen
        :return: Bool for if the user already exists in the list
        """
        return name in self.users
