import pytest
from backend.flaskr.yelp_api_utils import YelpAPI
from backend.flaskr.user import UserList, User


def test_user_list():
    # Initialize UserList and test params
    users = UserList(False)
    user = "Ben_test"

    # Ensure user is not in list
    assert user not in users

    # Ensure user is properly added
    users.add(user)
    assert user in users

    # Ensure exception is thrown when duplicate user is added
    with pytest.raises(ValueError):
        users.add(user)
    
    # Ensure user object is created properly
    user_obj = users[user]
    assert user_obj.reviews == [] and user_obj.model != None

def test_add_and_submit_review():
    # Initialize User and test params
    user = User("Ben")
    rest_id = "1234"
    
    # Ensure restaurants to be reviewed are added to the review list properly
    assert user.reviews == []
    user.add_review(rest_id)
    assert user.reviews == [rest_id]

    # Ensure reviewed restaurants are removed from the review list properly
    user.submit_review(rest_id, "It's bloody raw!")
    assert user.reviews == []
    with pytest.raises(ValueError):
        user.submit_review(rest_id, "I already said no")

def test_get_reviews():
    # Initialize User and test params
    user = User("Ben")
    rest_id = "5Po65ETa-YvsWwg68Ab9nA" # Harry's
    yelp = YelpAPI()

    # Ensure the object is properly parsed from Yelp
    user.add_review(rest_id)
    assert user.get_reviews(yelp)[0]["restaurant"]["name"] == "Harry's Chocolate Shop"


if __name__ == "__main__":
    pytest.main()
