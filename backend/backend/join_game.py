"""Module enables players to join a chosen game and adds the player to the turn order"""

def join_game(game_id, player_id):
    with Game(game_id) as game and Player(player_id) as player:
        if game.state == "waiting":
            player.turn_position = len(game.players) + 1
        else:
            pass
            #Possibly something if the game has started
            
