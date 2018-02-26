""" Jail module """
from backend.player import Player
from backend.game import Game


def go_to_jail(player_id):

    """Function that sends a player to jail
    """
    with Player(player_id) as player:
    	player.board_position = 10
    	player.jail_state = 'in_jail'

def leave_jail(player_id):

    """Function that removes a player from jail
    """
    with Player(player_id) as player:
    	player.jail_state = 'not_in_jail'