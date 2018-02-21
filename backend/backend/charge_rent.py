"""Module enables users to be charged rent
   when they land on owned properties
"""

import json
import sys
import cgitb
from backend.player import Player
from backend.game import get_games
from backend.properties import Property

cgitb.enable()


def charge_rent(source=sys.stdin, output=sys.stdout):
    """Entry point for a player to be charged
       rent and property owner gains rent amount
    """

    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    player_id = request["player_id"]
    games = get_games()
    game_id = None

    # Access the game the player is playing in
    # and the position the player is on the board
    with Player(player_id) as player:
        position = player.board_position
        for game in games:
            if player.username in games[game]:
                game_id = game
                break

        # Accesses owner of property; if the games's current
        # turn player doesn't own it, charge the player and
        # increase the property owner's balance
        with Property(position, game_id) as propertie:
            owner = propertie.owner
            rent = propertie.rent
            if owner.uid != player_id:
                player.balance -= rent
                owner.balance += rent

    json.dump({"player_id": "rent"}, output)
