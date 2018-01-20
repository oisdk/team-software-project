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
