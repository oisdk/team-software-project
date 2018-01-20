import unittest
import doctest
import backend.roll_die


class TestDiceRoll(unittest.TestCase):

    def test_numbers_rolled(self):
        for i in range(100):
            dice_roll = backend.roll_die.roll_dice()
            self.assertTrue(dice_roll >= 1 and dice_roll <= 6)

    def test_number_of_rolled_dice_is_two(self):
        self.assertEqual(len(backend.roll_die.roll_two_dice()), 2)

    def test_sum_of_rolled_dice_between_2_and_12(self):
        for roll in range(100):
            dice_roll_result = backend.roll_die.roll_two_dice()
            die_result_1 = dice_roll_result[0]
            die_result_2 = dice_roll_result[1]
            self.assertTrue((die_result_1 + die_result_2) >= 2 and
                            (die_result_1 + die_result_2) <= 12)


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.roll_die))
    return tests


if __name__ == '__main__':

    unittest.main()
