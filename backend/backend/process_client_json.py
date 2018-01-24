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

def request_dice_roll(source=sys.stdin, output=sys.stdout):
    """Entry point for the client sending username to server.

    >>>
    """
    request = json.load(source)
    client_username = request["username"]
    output.write('Content-Type: application/json\n\n')
    json.dump({"your_username": client_username}, output)
