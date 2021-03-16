"""Classes to store semi-permanent data associated with user"""

from backend.flaskr.user_data_utils import read_user_data, write_user_data

class User:
    """
    Container class for a user's data (e.g. restaurants to review and the user's model)
    """

    def __init__(self, name):
        """
        Initializes restaurant cache and Yelp API to get suggestions and
        maintain which restaurants have been recently rated.
        :param cache_timeout: Number of seconds to maintain stale restaurnt entries in cache
        :return: None
        """
        self.name = name
        user_dict = read_user_data(name)
        if user_dict:
            self.reviews = user_dict["reviews"]
            self.model = user_dict["model"]
        else:
            self.reviews = []
            self.model = None


class UserList:
    """
    Class to maintain collection of users with data actively in memory
    """

    def __init__(self):
        """
        Create an empty table of Users in memory. We add user data to memory as necessary
        :return: None
        """
        self.users = {}
    
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
        for user in self.users:
            if user.is_dirty:
                user.is_dirty = False
                write_user_data(user.name, user)
                
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
    
    def contains(self, name):
        """
        Check if name is already in the table of users
        :param name: Username entered on the registration screen
        :return: Bool for if the user already exists in the list
        """
        return name in self.users
