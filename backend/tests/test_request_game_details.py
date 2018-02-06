import unittest
import doctest
import backend.request_game_details


class TestRequestGameDetails(unittest.TestCase):
    pass


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.request_game_details))
    return tests


if __name__ == '__main__':
    unittest.main()
