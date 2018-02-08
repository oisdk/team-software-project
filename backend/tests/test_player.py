import unittest
import doctest
import backend.player


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.player))
    return tests


if __name__ == '__main__':
    unittest.main()
