"""Module providing functionality to retrieve requests, parse JSON, and call on
   roll die functionality.

"""
from cgitb import enable
from cgi import FieldStorage
from backend.roll_die import roll_two_dice
import json

enable()

def manager_function():
    print('Content-Type: text/html')
    print()
    client_request = interpret_request()
    dice_result = roll_dice()
    print("ack")
    return (client_request, dice_result)

def interpret_request():
    print('Content-Type: text/html')
    print()

    form_data = FieldStorage()

    json_data = form_data.getFirst("jsonrequest")
    client_request = json.loads(json_data)

    return client_request

def roll_dice():
    return roll_two_dice()
