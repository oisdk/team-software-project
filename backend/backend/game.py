"""Module to create game objects"""

import uuid


class Monopoly:  # pylint: disable=too-few-public-methods
    """A class representing a game of
    monopoly.
    """
    def __init__(self, gameSize):
        self._uuid = uuid.uuid1()
        self._game_size = gameSize
        self._players = []
        self._player_counter = 0
        self._game_ready_state = False

    @property
    def game_id(self):
        """A unique, read-only game id"""
        return self._uuid

    def __str__(self):
        return (('Game id:%s:\n Lobby State: %d/%d\nGame Ready:%s'
                 '\n Players:%s\n')
                % (self._uuid, self._player_counter,
                   self._game_size, self._game_ready_state, self._players))

    def add_player(self, player):
        """Adds player to game.
            Increments the number of players.
            Checks if game is full and toggles ready state.
            Communicates ready state to client
        """
        self._players.append(player)
        self._player_counter += 1
        if self._player_counter == self._game_size:
            self._game_ready_state = True
            # Communicate readiness to client

    def get_game_id(self):
        """Getter for game uuid"""
        return self._uuid