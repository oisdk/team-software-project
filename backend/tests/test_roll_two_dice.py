import unittest
import doctest
import backend.roll_two_dice


class TestStringMethods(unittest.TestCase):

    def test_number_of_rolled_dice_is_two(self):
        self.assertEqual(len(backend.roll_two_dice.roll_two_dice()), 2)

    def test_sum_of_rolled_dice_between_2_and_12(self):
        for roll in range(100):
            dice_roll_result = backend.roll_two_dice.roll_two_dice()
            die_result_1 = dice_roll_result[0]
            die_result_2 = dice_roll_result[1]
            self.assertTrue((die_result_1 + die_result_2) >= 2 and
                            (die_result_1 + die_result_2) <= 12)


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.roll_two_dice))
    return tests


if __name__ == '__main__':
    unittest.main()
