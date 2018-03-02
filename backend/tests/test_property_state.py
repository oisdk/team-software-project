import unittest
import doctest

import backend.property_state


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.property_state))
    return tests


if __name__ == '__main__':
    unittest.main()
