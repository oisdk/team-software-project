"""Module providing functionality to create a Game and send its ID back to
    the client"""

import json
import sys
import cgitb
import backend.game

cgitb.enable()


def request_game_id(source=sys.stdin, output=sys.stdout):
    """Entry point for the client creating game on server, server responds
    with games id.

    >>> import io
    >>> inp = io.StringIO(json.dumps({'game_size': 4}))
    >>> out = io.StringIO()
    >>> test = request_game_id(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"game_id": ...}
    """

    request = json.load(source)
    host_id = request["host_id"]
    game_id = backend.game.create_game(host_id)
    output.write('Content-Type: application/json\n\n')
    json.dump({"game_id": game_id}, output)
