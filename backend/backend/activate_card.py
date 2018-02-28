""" Module to handle the activating of chance and community chest cards. """

from random import randint
from backend.player import Player
from backend.property import Property

size_of_card_deck = 15

def activate_chance(player_id, game_id):
    # Pick a random number to index the card deck in the database
    card_table_id = randint(0, size_of_card_deck)
    # Dive into database to get the card details
    card_details = get_card_details(card_table_id)
    # Send the description to the client
    card_description = card_details["description"]
    pass
    # Check what type of chance card it is
    card_type = card_details["operation_type"]
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
                player.board_position -= int(card_value) # CHECK TYPES
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
            with Property(game_id, property_position) as p:
                total_houses += p.houses
                total_houses += (p.hotels * 4)
        # The card_value here indicates how much to pay for a single house
        to_pay = total_houses * card_value
        with Player(player_id) as player:
            player.balance -= to_pay

    # If it's a "get_money" type of chance card
    if card_type == "get_money":
        with Player(player_id) as player:
            # The card_value here indicates how much money to add to balance
            player.balance += int(card_value) # CHECK TYPES

    # If it's a "pay_bank" type of chance card
    if card_type == "pay_bank":
        with Player(player_id) as player:
            # The card_value here indicates how much to deduct from balance
            player.balance -= int(card_value) # CHECK TYPES
