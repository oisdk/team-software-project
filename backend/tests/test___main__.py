import unittest
import doctest
import backend.__main__

def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.__main__))
    return tests

if __name__ == '__main__':
    unittest.main()
