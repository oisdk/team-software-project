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
    start_game_db(request["game_id"])


def start_game_db(game_id):
    """Changes a game’s status to 'playing' in the database."""
    with backend.game.Game(game_id) as game:
        game.state = 'playing'
