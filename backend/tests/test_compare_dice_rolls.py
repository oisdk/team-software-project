import unittest
import doctest
import backend.compare_dice_rolls


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.compare_dice_rolls))
    return tests


if __name__ == '__main__':
    unittest.main()
