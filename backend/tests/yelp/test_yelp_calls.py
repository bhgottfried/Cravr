import pytest
from backend.flaskr.yelp_api_utils import YelpAPI


def test_search_with_location():
    # Make a valid search using a location string
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location="lafayette, in")
    assert "businesses" in result

def test_search_with_coordinates():
    # Make a valid search using location coordinates
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location=(40.4167, -86.8753))
    assert "businesses" in result

def test_bad_search():
    # Try to make a search using an invalid location value
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location=10)
    assert result is None

def test_business_details():
    # Get business details using a valid business ID
    yelp = YelpAPI()
    result = yelp.business_details(business_id="sushi-don-lafayette")
    assert "id" in result

def test_bad_business_id():
    # Try to get business details with a non-existent business ID
    yelp = YelpAPI()
    result = yelp.business_details(business_id="bad-business-id")
    assert "error" in result


if __name__ == "__main__":
    pytest.main()
