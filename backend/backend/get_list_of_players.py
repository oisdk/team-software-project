"""Module providing functionality to retrieve list of players
   of a specified game from the database.
"""

import sys
import json
import cgitb

from backend.game import Game

cgitb.enable()


def request_list_of_players(source=sys.stdin, output=sys.stdout):
    """Entry point for the service of requesting the list of
    players in a specfic game
    """
    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    game_id = request["game_id"]
    game = Game(game_id)
    players = game.players
    json.dump(players, output)
