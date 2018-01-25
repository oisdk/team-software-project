import unittest
import doctest
import backend.polling


class TestPolling(unittest.TestCase):
    pass


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.polling))
    return tests


if __name__ == '__main__':
    unittest.main()
