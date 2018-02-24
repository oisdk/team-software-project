"""Module for providing the functionality to
   detirmine if a player is declared bankrupt
"""

import json
import sys
import cgitb
from backend.player import Player
from backend.game import get_games
from backend.properties import Property, get_properties

cgitb.enable()


def is_bankrupt(source=sys.stdin, output=sys.stdout):
    """Player is checked if they are bankrupt or not"""

    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    player_id = request['player_id']

    with Player(player_id) as player:
        if player.balance < 0:
            player_remove(player_id)


def player_remove(player_id):
    """Player is removed from game with their status updated
       and appropriate changes commence (turn order, properties...)
    """
    games = get_games()
    with Player(player_id) as player:
        for game in games:
            if player.username in games[game]:
                game_id = game
                # Removes player from the game's list of players
                game.players.remove(player_id)
                break

    # This part receives properties owned by player by their
    # position and marks each property as 'unowned'
    property_positions = get_properties(player_id)
    for position in property_positions:
        with Property(position, game_id) as property_:
            property_.owner = 'unowned'
