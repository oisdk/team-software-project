import unittest
import doctest
from backend.get_list_of_games import get_list_of_games


class TestGetListOfGames(unittest.TestCase):

    def test_game_list_returned(self):
        games = ['game1', 'game2']
        list_of_games = get_list_of_games()
        self.assertEqual(len(games) == len(list_of_games))


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.get_list_of_games))
    return tests


if __name__ == '__main__':
    unittest.main()
