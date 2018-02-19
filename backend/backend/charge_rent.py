"""Module enables users to be charged rent
   when they land on owned properties
"""

import json
import sys
import cgitb
from backend.player import Player

cgitb.enable()

def charge_rent(source=sys.stdin, output=sys.stdout):
	"""Entry point for a player to be charged
	   rent and property owner gains rent amount
	"""

	output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    player_id = request["player_id"]

    with Player(player_id) as player:
    	player_position = player.board_position
    	pass
    	#get the property's position
    	#get who owns that property
    	#if the current player this turn doesn't own it
    		#get the property's rent
    		#current player's balance reduces by rent amount
    		#property owner's balance increases by rent amount

    json.dump({"player_id": "balance"}, output)
