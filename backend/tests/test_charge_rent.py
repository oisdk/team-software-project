import unittest
import doctest
import backend.charge_rent


class TestChargeRent(unittest.TestCase):
    pass


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.charge_rent))
    return tests


if __name__ == '__main__':
    unittest.main()
