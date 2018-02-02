import unittest
import doctest
import backend
from backend.game import Monopoly


class TestMonopolyGame(unittest.TestCase):
    def test_game(self):
        testgame = Monopoly(4)
        testgame.add_player("TestPlayer")
        self.assertEqual(testgame._players[0], "TestPlayer")
        self.assertEqual(testgame._player_counter, 1)
        self.assertEqual(testgame._game_size, 4)
        self.assertEqual(testgame._game_ready_state, False)
        testgame.add_player("TestPlayer1")
        testgame.add_player("TestPlayer2")
        testgame.add_player("TestPlayer3")
        self.assertEqual(testgame._game_ready_state, True)


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.game))
    return tests


if __name__ == '__main__':
    unittest.main()
