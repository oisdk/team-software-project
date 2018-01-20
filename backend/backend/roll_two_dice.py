""" Module to provide functionality to simulate rolling of two 6-sided dice"""

from backend.roll_die import roll_dice


def roll_two_dice():
    """Simulates the rolling of two 6-sided dice.

    Returns:
        An int array representing the result of the two dice rolls.

    """
    number_of_dice = 2
    dice_result = []
    for _ in range(number_of_dice):
        dice_result += [roll_dice()]

    return dice_result
