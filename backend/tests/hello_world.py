from backend.flaskr.app import say_hello_world

def test_hello_world():
    assert say_hello_world() == {'result': "Hello world!"}


if __name__ == "__main__":
    test_hello_world()
