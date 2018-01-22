import unittest
import doctest
import backend.process_client_json


class TestProcessClientJSON(unittest.TestCase):
    pass


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.process_client_json))
    return tests


if __name__ == '__main__':
    unittest.main()
