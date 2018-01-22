"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
import json
import sys
from backend.roll_die import roll_two_dice
import cgitb

cgitb.enable()


def request_dice_roll(source=sys.stdin):
    """Entry point for the service of requesting a dice roll

    >>> import tempfile
    >>> with tempfile.TemporaryFile(mode='w+') as fp:
    ...     json.dump({'type': 'gameStart'}, fp)
    ...     _ = fp.seek(0)
    ...     request_dice_roll(fp) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"diceRoll": [..., ...]}
    """
    request = json.load(source)
    assert request == {'type': 'gameStart'}
    print(generate_response())


def generate_response():
    """Generate a JSON response to send to the client.

    Returns:
        The JSON response to send to the client, as a string.

    >>> generate_response() # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    '{"diceRoll": [..., ...]}'
    """
    print('Content-Type: application/json')
    print()
    return json.dumps({"diceRoll": roll_two_dice()})
