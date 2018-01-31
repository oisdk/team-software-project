import unittest
import doctest
import backend
from backend.game import Monopoly


class TestMonopolyGame(unittest.TestCase):
    def test_game(self):
        testGame = Monopoly(4)
        testGame.add_player("TestPlayer")
        self.assertEqual(testGame._players[0], "TestPlayer")
        self.assertEqual(testGame._player_counter, 1)
        self.assertEqual(testGame._game_size, 4)
        self.assertEqual(testGame._game_ready_state, False)
        testGame.add_player("TestPlayer1")
        testGame.add_player("TestPlayer2")
        testGame.add_player("TestPlayer3")
        self.assertEqual(testGame._game_ready_state, True)


def load_tests(loader, tests, ignore):
    tests.addTests(doctest.DocTestSuite(backend.game))
    return tests


if __name__ == '__main__':
    unittest.main()
