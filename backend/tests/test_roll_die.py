import unittest
import doctest
import backend.roll_die


class TestDiceRoll(unittest.TestCase):

    def testNumbersRolled(self):
        for i in range(100):
            dice_roll = backend.roll_die.roll_dice()
            self.assertTrue(dice_roll >= 1  and dice_roll <= 6)

    def load_tests(loader, tests, ignore):
        tests.addTests(doctest.DocTestSuite(backend.roll_die))
        return tests
    
if __name__ == '__main__':
    unittest.main()
