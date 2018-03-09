"""Module enables users to be charged rent
   when they land on owned properties
"""

import cgitb
from backend.player import Player
from backend.game import get_games
from backend.properties import Property

cgitb.enable()


def charge_rent(player_id):
    """Entry point for a player to be charged
       rent and property owner gains rent amount
    """
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

        # Accesses owner and rent of property; if the games's
        # current turn's player doesn't own it, charge the player
        # and increase the property owner's balance
        with Property(position, game_id) as property_:
            owner_id = property_.owner
            rent = property_.rent

            with Player(owner_id) as owner:
                if owner.uid != player_id:
                    player.balance -= rent
                    owner.balance += rent
