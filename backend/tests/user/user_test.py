import pytest
from backend.flaskr.user import UserList, User


def test_add_user():
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
    assert user_obj.reviews == [] and user_obj.model == None


if __name__ == "__main__":
    pytest.main()
