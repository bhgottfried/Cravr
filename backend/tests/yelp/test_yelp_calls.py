import pytest
from backend.flaskr.yelp_api_utils import YelpAPI


def test_search_with_location():
    # Make a valid search using a location string
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location="lafayette, in", open_now=False)
    assert "businesses" in result

def test_search_with_coordinates():
    # Make a valid search using location coordinates
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location=(40.4167, -86.8753), open_now=False)
    assert "businesses" in result

def test_bad_search():
    # Try to make a search using an invalid location value
    yelp = YelpAPI()
    result = yelp.business_search(term="sushi", location=10, open_now=False)
    assert result is None

def test_business_details():
    # Get business details using a valid business ID
    yelp = YelpAPI()
    result = yelp.business_details(business_id="sushi-don-lafayette")
    assert "id" in result

def test_business_details_bad_id():
    # Try to get business details using a non-existent business ID
    yelp = YelpAPI()
    result = yelp.business_details(business_id="bad-business-id")
    assert "error" in result

def test_business_reviews():
    # Get business reviews using a valid business ID
    yelp = YelpAPI()
    result = yelp.business_reviews(business_id="sushi-don-lafayette")
    assert "possible_languages" in result

def test_business_reviews_bad_id():
    # Try to get business reviews using a non-existent business ID
    yelp = YelpAPI()
    result = yelp.business_reviews(business_id="bad-business-id")
    assert "error" in result


if __name__ == "__main__":
    pytest.main()
