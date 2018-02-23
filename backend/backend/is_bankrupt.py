"""Module for providing the functionality to
   detirmine if a player is declared bankrupt
"""

import json
import sys
import cgitb
import backend.player import Player
import backend.game import Game
import backend.properties import Property

cgitb.enable()


def is_bankrupt(source=sys.stdin, output=sys.stdout):
    """Player is checked if they are bankrupt or not"""

    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    player_id = request['player_id']

    with Player(player_id) as player:
        if player.balance < 0:
            remove_player(player_id)


def remove_player(player_id):
    """Player is removed from game with their status updated
       and appropriate changes commence (turn order, properties...)
    """
    pass
