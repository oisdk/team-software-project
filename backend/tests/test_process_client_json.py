import unittest
import doctest
import backend.process_client_json

SAMPLE_DICTIONARY_OBJECT = {"key": "value"}


class TestProcessClientJSON(unittest.TestCase):

    def test_interpret_request(self):
        self.assertRaises(TypeError,
                          backend.process_client_json.interpret_request)

    def test_manager(self):
        self.assertRaises(TypeError,
                          backend.process_client_json.manager_function)


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.process_client_json))
    return tests


if __name__ == '__main__':

    unittest.main()
