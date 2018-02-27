"""Module enables players to end their turn"""
import json
import sys
import cgitb
from backend.game import Game, get_games
from backend.player import Player
from backend.is_bankrupt import is_bankrupt

cgitb.enable()


def increment_turn(source=sys.stdin, output=sys.stdout):
    """Entry point for the client ending their turn
    """
    output.write('Content-Type: application/json\n\n')
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
                turn += 1
            game.current_turn = turn

    is_bankrupt(player_id)

    json.dump({"turn": "turn_over"}, output)
