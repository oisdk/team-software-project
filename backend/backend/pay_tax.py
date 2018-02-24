""" Module providing functionality for players to pay tax. """

def pay_tax(player_id, tax_payable):
    player = Player(player_id)
    player.balance -= tax_payable
