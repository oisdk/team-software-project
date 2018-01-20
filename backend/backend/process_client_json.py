"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
from cgitb import enable
from cgi import FieldStorage
from backend.roll_die import roll_two_dice
import json

enable()

sample_dictionary_object = {"key":"value"}

def manager_function():
    print('Content-Type: text/html')
    print()
    client_request = interpret_request()
    dice_result = roll_dice()
    print("ack")
    return "ack"

def interpret_request():
    print('Content-Type: text/html')
    print()

    form_data = FieldStorage()

    json_data = form_data.getfirst("jsonrequest")
    if (json_data == None):
        client_request = sample_dictionary_object
    else:
        client_request = json.loads(json_data)

    return client_request

def roll_dice():
    return roll_two_dice()
