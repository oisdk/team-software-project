"""
Tests the events module.
"""

import unittest
import doctest
import backend.events


def load_tests(_loader, tests, _ignore):
    """Load the docstring tests."""
    tests.addTests(doctest.DocTestSuite(backend.events))
    return tests


if __name__ == '__main__':
    unittest.main()
