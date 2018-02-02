import unittest
import doctest
import backend
from backend.mock_storage import Storage


class TestMockStorage(unittest.TestCase):
    def test_storage(self):
        test_storage = Storage(3)
        self.assertEqual(len(test_storage._games), 3)
        test_game_storage = test_storage.get_games()
        self.assertEqual(test_game_storage, test_storage.get_games())
        for i in range(2):
            self.assertEqual(test_storage._games[i], test_game_storage[i])
            self.assertEqual(test_storage._games[i], test_storage.get_game_by_id(test_storage._games[i].get_game_id()))
        
        
        
        
def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.mock_storage))
    return tests


if __name__ == '__main__':
    unittest.main()
