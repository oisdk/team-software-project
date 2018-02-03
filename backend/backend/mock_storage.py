"""A module to mock up the storage
"""

from backend.game import Monopoly


class Storage:
    """A class representing the mocked storage.

        Creates a given number of games on the storage.
        >>> print(Storage(1)) # doctest: +ELLIPSIS
        [Game id:...
        Lobby State:0/4
        Game Ready:False
        Players:[]
        ]
    """
    def __init__(self, number_of_games):
        self._games = []
        for _ in range(number_of_games):
            self._games.append(Monopoly(4))

    def __str__(self):
        return str(self._games)

    def add_game(self):
        """Adds a game to the storage"""
        self._games.append(Monopoly(4))

    def get_games(self):
        """Gets list of games form storage"""
        return self._games

    def get_game_by_id(self, game_id):
        """Gets game with given id from the storage"""
        game_to_return = None
        for game in self._games:
            if game.get_game_id() == game_id:
                game_to_return = game

        return game_to_return
