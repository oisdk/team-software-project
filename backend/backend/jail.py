""" Jail module """
import sys
import cgitb
import json
from backend.player import Player

cgitb.enable()


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


def pay_to_leave_jail(source=sys.stdin, output=sys.stdout):

    """Function that removes a player from jail for a fee
    """
    output.write("Content-Type: text/plain\n")
    output.write("\n")

    request = json.load(source)
    player_id = request["player_id"]
    with Player(player_id) as player:
        player.balance -= 50
        player.jail_state = 'not_in_jail'
    json.dump({player_id: 'not_in_jail'}, output)
