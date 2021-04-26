import pytest
from time import sleep
from backend.flaskr.restaurant_cache import RestaurantCache


def test_add_restaurant():
    # Initialize cache and test params
    user = "Ben"
    ID = "1234"
    cache = RestaurantCache()
    # Ensure adding a restaurant inserts it into cache
    assert not cache.is_cached(user, ID)
    cache.add_restaurant(user, ID)
    assert cache.is_cached(user, ID)

def test_clean_cache():
    # Initialize cache and test params
    timeout = 2
    user = "Ben"
    ID = "1234"
    cache = RestaurantCache(timeout)
    # Ensure the restaurant is removed only after timeout
    cache.add_restaurant(user, ID)
    assert cache.is_cached(user, ID)
    sleep(timeout + 0.1)
    assert not cache.is_cached(user, ID)  


if __name__ == "__main__":
    pytest.main()
