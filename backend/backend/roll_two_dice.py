from roll_die import roll_dice

def roll_two_dice():
    """ Simulates the rolling of two dice.

        Returns:
            An int array representing the result of the two dice rolls.
    """

    dice_result = []
    dice_result += [roll_dice()]
    dice_result += [roll_dice()]

    return dice_result
