"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
from cgitb import enable
from cgi import FieldStorage
from backend.roll_die import roll_two_dice
import json

enable()

sample_dictionary_object = {"key": "value"}


def manager_function():
    """Function to act as start point for client requests sending JSON.

    Returns:
        An ack string to inform the function terminated successfully.

    """
    print('Content-Type: text/html')
    print()
    client_request = interpret_request()
    dice_result = roll_dice()
    print((client_request, dice_result))
    return "ack"


def interpret_request():
    """Function to take in parameters sent in client request and extract JSON.

    Returns:
        A dictionary representing the parsed JSON from the client.

    """
    print('Content-Type: text/html')
    print()

    form_data = FieldStorage()

    json_data = form_data.getfirst("jsonrequest")
    if (json_data is None):
        client_request = sample_dictionary_object
    else:
        client_request = json.loads(json_data)

    return client_request


def roll_dice():
    """Function call roll_

    Returns:
        A dictionary representing the parsed JSON from the client.

    """
    return roll_two_dice()
