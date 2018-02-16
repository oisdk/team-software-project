"""Module providing functionality to update an existing
   game's state.
"""


import json
import sys
import cgitb
import backend.game


cgitb.enable()


def start_game(source=sys.stdin, output=sys.stdout):
    """Updates a requested game's state to 'playing' by
       its game id.
    """

    output.write("Content-Type: text/plain\n")
    output.write("\n")

    request = json.load(source)
    game_id = request["game_id"]
    with backend.game.Game(game_id) as game:
        game.state = 'playing'
