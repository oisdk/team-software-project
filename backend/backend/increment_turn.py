"""Module enables players to end their turn"""
import json
import sys
import cgitb
from backend.game import Game, get_games
from backend.player import Player

cgitb.enable()


def increment_turn(source=sys.stdin):
    """Entry point for the client ending their turn
    """
    request = json.load(source)
    player_id = request["player_id"]
    games = get_games()

    with Player(player_id) as player:
        for game in games:
            if player.username in games[game]:
                game_id = game
                break

        with Game(game_id) as game:
            turn = game.current_turn
            if turn == len(game.players)-1:
                turn = 0
            else:
                turn+=1
            game.current_turn = turn
