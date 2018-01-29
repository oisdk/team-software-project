"""Module providing functionality to create a player and send their ID back to
    the client"""

import json
import sys
import cgitb
from uuid import UUID
from backend.storage import Player

cgitb.enable()


def json_encoder(uuid_object):
    """Deals with no UUID serialization support in json. Casts the UUID to String.
    """
    if isinstance(uuid_object, UUID):
        return str(uuid_object)
    return None


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
    {"your_username": "testuser", "your_id": ...}
    """
    request = json.load(source)
    client_username = request["username"]
    player = Player(client_username)
    output.write('Content-Type: application/json\n\n')
    json.dump({"your_username": client_username, "your_id":
               json_encoder(player.user_id)}, output)
