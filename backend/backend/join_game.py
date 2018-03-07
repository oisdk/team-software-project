"""Module enables players to join a chosen game and
adds the player to the turn order"""
import json
import sys
import cgitb
from backend.game import Game
from backend.player import Player

cgitb.enable()


def join_game(source=sys.stdin, output=sys.stdout):
    """Entry point for the client joining game on server
    """

    output.write("Content-Type: text/plain\n")
    output.write("\n")

    request = json.load(source)
    add_player(request["user_id"], request["game_id"])


def add_player(player_id, game_id):
    """Adds a player to a game."""
    with Player(player_id) as player:
        with Game(game_id) as game:
            players = game.players
            players.append(player_id)
            game.players = players
            if str(game.state) == 'waiting':
                player.turn_position = len(game.players)-1
            else:
                pass
                # Possibly something if the game has started
