""" Module to handle the activating of chance and community chest cards. """

from random import randint
from backend.player import Player
from backend.game import Game
from backend.properties import Property
from backend.properties import get_properties
from backend.cards import get_card_details

LAST_CHANCE_INDEX_IN_TABLE = 29
LAST_CHEST_INDEX_IN_TABLE = 14


def activate_card(player_id, game_id, card_landed_on):
    # pylint: disable=too-many-locals
    """Read a chance or community chest card that the player landed on.

    Arguments:
        player_id: An int representing the current player id.
        game_id: An int representing the current game id.
        card_landed_on: An int representing the type of card the player has
            activated

    """
    # Check if card is chance or community chest
    if card_landed_on == "chest":
        card_table_id = randint(0, LAST_CHEST_INDEX_IN_TABLE)
    else:
        card_table_id = randint(LAST_CHEST_INDEX_IN_TABLE + 1,
                                LAST_CHANCE_INDEX_IN_TABLE)

    # Dive into database to get the card details
    card_details = get_card_details(card_table_id)

    # Check what type of chance card it is
    card_type = card_details["operation"]

    # Get the card description, this is what's sent to the client
    card_description = card_details["description"]

    # Get value
    # This card_value is unique in that it represents different things
    # depending on the card_type. See below comments for more information
    card_value = card_details["operation_value"]

    # If it's a "move_specific" type of chance card
    if card_type == "move_specific":
        # Update the player position in players table with "chance" value
        with Player(player_id) as player:
            # Check if the card wants the player to move back some spaces
            # or simply *jump* to a specific space on the board
            if card_value < 0:
                # The card value here indicates how many spaces to move back
                player.board_position += card_value
            else:
                # The card value here indicates the board position to move to
                player.board_position = card_value

    # If it's a "pay_per_house" type of chance card
    elif card_type == "pay_per_house":
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
    elif card_type == "get_money":
        with Player(player_id) as player:
            # The card_value here indicates how much money to add to balance
            player.balance += card_value

    # If it's a "pay_bank" type of chance card
    elif card_type == "pay_bank":
        with Player(player_id) as player:
            # The card_value here indicates how much to deduct from balance
            player.balance -= card_value

    elif card_type == "collect_from_opponents":
        # Get a list of players in this game
        players_in_game = []
        with Game(game_id) as game:
            players_in_game = game.players

        # Iterate through each player and deduct from their balance if they
        # are not the current (aka. this) player
        for id_ in players_in_game:
            if player_id != id_:
                with Player(id_) as opponent:
                    # card_value here indicates the amount to deduct from
                    # opponent's balance
                    opponent.balance -= card_value

        # Add to this player's balance the total amount deducted from the
        # opponents.
        # Note that the amount to add to this player's balance can be found
        # by simply multiplying the amount to deduct per opponent
        # (i.e. card_value) by the *number* of opponents
        with Player(player_id) as player:
            player.balance += card_value * (len(players_in_game) - 1)

    return card_description
