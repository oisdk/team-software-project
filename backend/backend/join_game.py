"""Module enables players to join a chosen game and adds the player to the turn order"""
from backend.game import Game
from backend.player import Player

def join_game(game_id, player_id):
    with Player(player_id) as player:
        with Game(game_id) as game:
            players = game.players
            players.append(player_id)
            game.players = players
            state = str(game.state)
            if str(game.state) == 'waiting':
                player.turn_position = len(game.players)
            else:
                pass
                #Possibly something if the game has started
