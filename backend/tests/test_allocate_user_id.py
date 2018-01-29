import unittest
import doctest
import backend.allocate_user_id
from backend.allocate_user_id import JSONEncoder
from backend.storage import Player


class TestRequestUserID(unittest.TestCase):

    def testEncoder(self):
        encodeTest = Player("username")
        self.assertEqual(str(encodeTest.user_id), JSONEncoder(encodeTest.user_id))


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.allocate_user_id))
    return tests


if __name__ == '__main__':
    unittest.main()
