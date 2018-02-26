""" Module providing functionality for players to pay tax. """

from backend.player import Player


def pay_tax(player_id, tax_payable):
    """Deduct tax payable from player's balance.

    Arguments:
        player_id: An int representing the player_id.
        tax_payable: An int representing the money to deduct from player.

    """
    with Player(player_id) as player:
        player.balance -= tax_payable
