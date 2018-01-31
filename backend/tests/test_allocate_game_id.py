import unittest
import doctest
import backend.allocate_game_id


class TestRequestGameID(unittest.TestCase):
    pass



def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.allocate_game_id))
    return tests


if __name__ == '__main__':
    unittest.main()
