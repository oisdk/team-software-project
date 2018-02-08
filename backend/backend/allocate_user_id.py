"""Module providing functionality to create a player and send their ID back to
    the client"""

import json
import sys
import cgitb
import backend.player

cgitb.enable()

def request_user_id(source=sys.stdin, output=sys.stdout):
    """Entry point for the client sending username to server, server responds
    with clients username & id.

    >>> import io
    >>> inp = io.StringIO(json.dumps({'username': 'testuser'}))
    >>> out = io.StringIO()
    >>> test = request_user_id(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"your_id": ..., "your_username": "testuser"}
    """
    request = json.load(source)
    client_username = request["username"]
    output.write('Content-Type: application/json\n\n')
    uid = backend.player.create_player(client_username)
    json.dump({"your_username": client_username, "your_id": uid}, output, sort_keys=True)
