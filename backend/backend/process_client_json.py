"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
from cgitb import enable
from cgi import FieldStorage
import json
from backend.roll_die import roll_two_dice

enable()


def interpret_request():
    """Function to take in parameters sent in client request, extract JSON, and
       roll dice.

    Returns:
        A dictionary representing the parsed JSON from the client.

    """

    form_data = FieldStorage()
    json_data = form_data.getfirst("jsonrequest")
    try:
        client_request = json.loads(json_data)
    except TypeError:
        client_request = None
    dice_result = roll_two_dice()
    print((client_request, dice_result))

    return client_request

def generate_response(dice_roll):
    """Generate a JSON response to send to the client.

    Arguments:
        dice_roll: A sequence of two values – the dice roll the client got.

    Returns:
        The JSON response to send to the client, as a string.

    >>> generate_response([4, 7])
    '{"diceRoll": [4, 7]}'
    """
    return json.dumps({"diceRoll": dice_roll})
