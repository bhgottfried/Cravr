import pytest
from backend.flaskr.model_utils import *


def test_get_categories():
    # Make a valid search using a generic term
    categories = get_categories("burgers")
    assert "burgers" in categories or "beerbar" in categories

def test_create_genre_dict():
    # Test creating a genre dictionary
    genres = create_genre_dict("chinese", "burgers")
    assert ("chinese" in genres and genres["chinese"] == 7) or \
            ("hainanese" in genres and genres["hainanese"] == 7) or \
            ("cantonese" in genres and genres["cantonese"] == 7)
    assert ("burgers" in genres and genres["burgers"] == -7) or \
            ("beerbar" in genres and genres["beerbar"] == 7)


if __name__ == "__main__":
    pytest.main()
