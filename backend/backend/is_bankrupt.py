"""Module for providing the functionality to
   detirmine if a player is declared bankrupt
"""

from backend.player import Player
from backend.game import get_this_game, Game
from backend.properties import Property, get_properties


def is_bankrupt(player_id):
    """Player is checked if they are bankrupt or not"""
    player = Player(player_id)
    if player.balance < 0:
        player_remove(player)


def player_remove(player):
    """Player is removed from game with their status updated
       and appropriate changes commence (turn order, properties...)
    """
    player_id = player.uid
    game_id = get_this_game(player_id)
    with Game(game_id) as game:
        # Removes player by id from the game's list of players
        game.players = [p for p in game.players if p != player_id]

        # This part receives properties owned by player by their
        # position and marks each property as 'unowned'
        property_positions = get_properties(player_id)
        for position in property_positions:
            with Property(position, game_id) as property_:
                property_.owner = 0
                property_.state = 'unowned'
                property_.houses = 0
                property_.hotels = 0

        game.state = 'finished'
