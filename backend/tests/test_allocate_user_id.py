import unittest
import doctest
import backend.allocate_user_id
from backend.allocate_user_id import json_encoder
from backend.storage import Player


class TestRequestUserID(unittest.TestCase):

    def test_encoder(self):
        encodetest = Player("username")
        self.assertEqual(str(encodeTest.user_id),
                         json_encoder(encodeTest.user_id))
        self.assertEqual(None, json_encoder("test"))


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.allocate_user_id))
    return tests


if __name__ == '__main__':
    unittest.main()
