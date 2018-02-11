"""Module enables players to join a chosen game and adds the player to the turn order"""
<<<<<<< HEAD
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
=======

def join_game(game_id, player_id):
    with Player(player_id) as player:
        game = Game(game_id)
        if game.state == "waiting":
            player.turn_position = len(game.players) + 1
        else:
            pass
            #Possibly something if the game has started
            
>>>>>>> 9eb55506e32baa017191fc284c4bab77c4ed7bc7
