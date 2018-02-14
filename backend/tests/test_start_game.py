import unittest
import doctest
import backend.start_game


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.start_game))
    return tests


if __name__ == '__main__':
    unittest.main()
