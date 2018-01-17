import unittest
import doctest
import backend.random

class TestRandom(unittest.TestCase):
    def test_get_random_number(self):
        self.assertEqual(backend.random.get_random_number(), 4)

def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.random))
    return tests

if __name__ == '__main__':
    unittest.main()
