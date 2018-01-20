import unittest
import doctest
import backend.process_client_json

sample_dictionary_object = {"key": "value"}


class TestProcessClientJSON(unittest.TestCase):

    def test_roll_dice(self):
        for i in range(100):
            dice_roll = backend.process_client_json.roll_dice()
            self.assertTrue(dice_roll[0] + dice_roll[1] >= 2 and
                            dice_roll[0] + dice_roll[1] <= 12)

    def test_interpret_request(self):
        self.assertEqual(backend.process_client_json.interpret_message(),
                         sample_dictionary_object)

    def test_manager(self):
        self.assertEqual(backend.process_client_json.manager_function(), "ack")


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.process_client_json))
    return tests


if __name__ == '__main__':

    unittest.main()
