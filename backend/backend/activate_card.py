""" Module to handle the activating of chance and community chest cards. """

from random import randint
from backend.player import Player
from backend.game import Game
from backend.properties import Property
from backend.properties import get_properties
from backend.cards import get_card_details

SIZE_OF_CARD_DECK = 15


def activate_card(player_id, game_id):  # pylint: disable=too-many-locals
    """Read a chance or community chest card that the player landed on.

    Arguments:
        player_id: An int representing the current player id.
        game_id: An int representing the current game id.

    """
    # Pick a random number to index the card deck in the database
    card_table_id = randint(0, SIZE_OF_CARD_DECK)

    # Dive into database to get the card details
    card_details = get_card_details(card_table_id)

    # Check what type of chance card it is
    card_type = card_details["operation_type"]

    # Send the *type* and *description* to the client
    # ...

    # Get value
    # This card_value is unique in that it represents different things
    # depending on the card_type. See below comments for more information
    card_value = card_details["value"]

    # If it's a "move_specific" type of chance card
    if card_type == "move_specific":
        # Update the player position in players table with "chance" value
        with Player(player_id) as player:
            # Check if the card wants the player to move back some spaces
            # or simply *jump* to a specific space on the board
            if card_value < 0:
                # The card value here indicates how many spaces to move back
                player.board_position -= int(card_value)  # CHECK TYPES
            else:
                # The card value here indicates the board position to move to
                player.board_position = int(card_value)

    # If it's a "pay_per_house" type of chance card
    if card_type == "pay_per_house":
        # Variable to store total houses owned (hotels are worth four houses)
        total_houses = 0
        # Get a *list* of all properties owned by the current player
        # Note that get_properties() returns a dictionary so we index the dict
        # with the player_id so a list of property positions is returned
        this_player_properties = get_properties(player_id)[player_id]
        # Go through each property
        for property_position in this_player_properties:
            with Property(game_id, property_position) as property_:
                total_houses += property_.houses
                total_houses += (property_.hotels * 4)
        # The card_value here indicates how much to pay for a single house
        to_pay = total_houses * card_value
        with Player(player_id) as player:
            player.balance -= to_pay

    # If it's a "get_money" type of chance card
    if card_type == "get_money":
        with Player(player_id) as player:
            # The card_value here indicates how much money to add to balance
            player.balance += int(card_value)  # CHECK TYPES

    # If it's a "pay_bank" type of chance card
    if card_type == "pay_bank":
        with Player(player_id) as player:
            # The card_value here indicates how much to deduct from balance
            player.balance -= int(card_value)  # CHECK TYPES

    if card_type == "collect_from_opponents":
        # Get a list of *opponents* in this game
        with Game(game_id) as game:
            # ".remove" will remove this player's id from the list of all
            # players
            opponents = game.players.remove(player_id)

        # Iterate through each player and deduct from their balance
        for opponent_id in opponents:
            with Player(opponent_id) as opponent:
                # card_value here indicates the amount to deduct from
                # opponent's balance
                opponent.balance -= int(card_value)  # Check types

        # Add to this player's balance the total amount deducted from the
        # opponents.
        # Note that the amount to add to this player's balance can be found
        # by simply multiplying the amount to deduct per opponent
        # (aka. card_value) by the *number* of opponents
        with Player(player_id) as player:
            player.balance += int(card_value) * len(opponents)
