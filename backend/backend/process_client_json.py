"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
import json
import sys
import cgitb
from backend.roll_die import roll_two_dice

cgitb.enable()


def request_dice_roll(source=sys.stdin, output=sys.stdout):
    """Entry point for the service of requesting a dice roll

    >>> import io
    >>> inp = io.StringIO(json.dumps({'type': 'gameStart'}))
    >>> out = io.StringIO()
    >>> request_dice_roll(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"diceRoll": [..., ...]}
    """
    request = json.load(source)
    assert request == {'type': 'gameStart'}
    output.write('Content-Type: application/json\n\n')
    json.dump({"diceRoll": roll_two_dice()}, output)


def receive_client_username(source=sys.stdin, output=sys.stdout):
    """Entry point for the client sending username to server.

    >>> import io
    >>> inp = io.StringIO(json.dumps({'username': 'testuser'}))
    >>> out = io.StringIO()
    >>> receive_client_username(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"your_username": "testuser"}
    """
    # Get the JSON request from standard input (which is the client's request)
    request = json.load(source)
    # Get the client's username from the request JSON
    client_username = request["username"]
    output.write('Content-Type: application/json\n\n')
    # Send the client's username back via standard out (which is the client)
    json.dump({"your_username": client_username}, output)
