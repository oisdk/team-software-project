""" Roll die module """
from random import randint


def roll_dice():

    """Function that returns a number between 1 and 6
       to represent the numbers of a die.
    """
    return randint(1, 6)
