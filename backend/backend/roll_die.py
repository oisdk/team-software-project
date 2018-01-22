""" Roll die module """
from random import randint
import json


def roll_dice():

    """Function that returns a number between 1 and 6
       to represent the numbers of a die.
    """
    return randint(1, 6)


def roll_two_dice():
    """Simulates the rolling of two 6-sided dice.

    Returns:
        An int tuple representing the result of the two dice rolls.

    """
    dice_result = (roll_dice(), roll_dice())
    return dice_result


def roll_two_dice_json():
    """Rolls 2 dice, returns the result in JSON

    >>> roll_two_dice_json() #doctest: +ELLIPSIS
    '{"roll_result": [..., ...]}'
    """
    return json.dumps({'roll_result': roll_two_dice()})
