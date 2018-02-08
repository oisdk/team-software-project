"""Module providing functionality to retrieve information
   of specified existing game for from the database.
"""

import sys
import json
import cgitb

import backend.game

cgitb.enable()


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
    game_info = backend.game.Game(game_id).state
    output.write('Content-Type: application/json\n\n')
    json.dump({game_id: game_info}, output)
