"""Module providing functionality to compare
   dice roll values of a player
"""

import sys
import json
import cgitb

import backend.player

cgitb.enable()


def compare_dice_rolls(source=sys.stdin, output=sys.stdout):
    """Entry point for requesting the boolean comparision
       result of a player's two dice roll values
    """
    request = json.load(source)
    player_id = request["player_id"]
    output.write('Content-Type: application/json\n\n')
    roll = backend.player.Player(player_id).rolls
    json.dump(roll[0] == roll[1], output)
   
