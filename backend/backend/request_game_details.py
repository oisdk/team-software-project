"""Module providing functionality to retrieve information
   of specified existing game for from the database.
"""

import sys
import json
import cgitb
from backend.game import Monopoly


cgitb.enable()


# No persistance storage so making mock existing games and storing
# in a list as a mock storage"""
GAME_ONE = Monopoly(1)
GAME_TWO = Monopoly(2)
STORAGE = [GAME_ONE, GAME_TWO]


def request_game_details(source=sys.stdin, output=sys.stdout):
    """Entry point for the service of requesting information of
    an available game
    >>> import io
    >>> inp = io.StringIO(json.dumps({'game_id': 123}))
    >>> out = io.StringIO()
    >>> request_game_details(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {...:...}
    """
    request = json.load(source)
    game_id = request["game_id"]
    game_info = ""
    for game in STORAGE:
        if game.get_game_id() == game_id:
            game_info = str(game)
    output.write('Content-Type: application/json\n\n')
    json.dump({game_id: game_info}, output)
