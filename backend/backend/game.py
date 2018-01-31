"""Module to create game objects"""

import uuid


class Monopoly:  # pylint: disable=too-few-public-methods
    """A class representing a game of
    monopoly.
    
    """
    def __init__(self, gameSize):
        self._uuid = uuid.uuid1()
        self._gameSize = gameSize
        self._players = []
        self._playerCounter = 0
        self._gameReadyState = False;

    @property
    def game_id(self):
        """A unique, read-only game id"""
        return self._uuid

    def __str__(self):
        return 'Game id:%s:\n Lobby State: %d/%d\nGame Ready:%s\n Players:%s\n' % (self._uuid, self._playerCounter, self._gameSize, self._gameReadyState, self._players)

    def add_player(self, player):
        """Adds player to game.
            Increments the number of players.
            Checks if game is full and toggles ready state.
            Communicates ready state to client
        """
        self._players.append(player)
        self._playerCounter+=1
        if(self._playerCounter == self._gameSize):
            self._gameReadyState = True;
            #Communicate readiness to client
        

def main():
    test = Monopoly(4)
    print(test)
    test.add_player("Gary")
    print(test)
    test.add_player("Edward")
    print(test)
    test.add_player("John")
    print(test)
    test.add_player("Greer")
    print(test)

main()
