import unittest
import doctest
import backend.events


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.events))
    return tests


if __name__ == '__main__':
    unittest.main()
