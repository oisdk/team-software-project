import unittest
import doctest
import backend.allocate_user_id


class TestRequestUserID(unittest.TestCase):
    pass


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.allocate_user_id))
    return tests


if __name__ == '__main__':
    unittest.main()
