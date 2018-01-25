import unittest
import doctest
import backend.storage


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.storage))
    return tests


if __name__ == '__main__':
    unittest.main()
