"""Module providing functionality to retrieve list of players
   of a specified game from the database.
"""

import sys
import json
import cgitb

import backend.game

cgitb.enable()


def request_list_of_players(source=sys.stdin, output=sys.stdout):
    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    game_id = request["game_id"]
    players = backend.game.Game(game_id).players()
    json.dump(players, output)
