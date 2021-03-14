import pytest
from backend.flaskr.recommender import Recommender


def test_get_good_restaurant():
    # Initialize recommender and test params
    recommender = Recommender()
    user = "Ben"
    params = {
        "food": "sushi",
        "price": "$$",
        "distance": "5",
        "location": "(40.4167, -86.8753)"
    }

    # Ensure a restaurant is returned
    result = recommender.get_restaurant(user, params)
    assert result["Name"] != "No matches found!"

def test_get_bad_restaurant():
    # Initialize recommender and test params
    recommender = Recommender()
    user = "Ben"
    params = {
        "food": "bowl of nails without any milk",
        "price": "$$",
        "distance": "1",
        "location": "(0, 0)"
    }

    # Ensure no recommendation is returned
    result = recommender.get_restaurant(user, params)
    assert result["Name"] == "No matches found!"

def test_cache():
    # Initialize recommender test params
    recommender = Recommender()
    user = "Ben"
    ID = "1234"

    # Ensure the recommender can cache the entry
    assert not recommender.cache.is_cached(user, ID)
    recommender.cache_restaurant(user, ID)
    assert recommender.cache.is_cached(user, ID)


if __name__ == "__main__":
    pytest.main()
