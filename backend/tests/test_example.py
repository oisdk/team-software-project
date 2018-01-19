import unittest
import doctest
import backend.example

def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.example))
    return tests

if __name__ == '__main__':
    unittest.main()
