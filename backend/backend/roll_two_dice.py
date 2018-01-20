from roll_die import roll_dice

def roll_two_dice():
    dice_result = []
    dice_result += [roll_dice()]
    dice_result += [roll_dice()]
    
    return dice_result
