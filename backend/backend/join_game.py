"""Module enables players to join a chosen game and
adds the player to the turn order"""
import json
import sys
import cgitb
from backend.game import Game
from backend.player import Player

cgitb.enable()


def join_game(source=sys.stdin):
    """Entry point for the client joining game on server
    """
    request = json.load(source)
    player_id = request["user_id"]
    game_id = request["game_id"]

    with Player(player_id) as player:
        with Game(game_id) as game:
            players = game.players
            players.append(player_id)
            game.players = players
            if str(game.state) == 'waiting':
                player.turn_position = len(game.players)
            else:
                pass
                # Possibly something if the game has started
