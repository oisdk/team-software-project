import unittest
import doctest
import backend.game


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.game))
    return tests


if __name__ == '__main__':
    unittest.main()
