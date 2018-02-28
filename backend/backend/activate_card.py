""" Module to handle the activating of chance and community chest cards. """

from random import randint

size_of_card_deck = 15

def activate_chance(player_id, game_id):
    # Pick a random number to index the card deck in the database
    card_table_id = randint(0, size_of_card_deck)
    # Tap into DB and get the card details
    card_details = get_card_details(card_table_id)
    # Send the description to the client
    pass
    # Check what type of chance card it is
    card_type = card_details["operation_type"]
    # Get value
    card_value = card_details["value"]

    # If it's a move_specific
    if card_type == "move_specific":
        # Update the player position in players table with "chance" value
        with Player(player_id) as player:
            if card_value < 0:
                player.board_position -= int(card_value) # CHECK TYPES
            else:
                player.board_position = int(card_value)


    # If it's a pay_per_house
    if card_type == "pay_per_house":
        # Variable to store total houses owned (hotels worth three houses)
        total_houses = 0
        # Get a LIST of all properties owned by the current player
        this_player_properties = get_properties(player_id)[player_id]
        # go through each property
        for property_position in this_player_properties:
            with Property(game_id, property_position) as p:
                total_houses += p.houses
                total_houses += (p.hotels * 4)
        to_pay = total_houses * card_value
        with Player(player_id) as player:
            player.balance -= to_pay

    # If it's a get_money
    if card_type == "get_money":
        with Player(player_id) as player:
            player.board_position += int(card_value) # CHECK TYPES

    # If it's a pay_bank
    if card_type == "pay_bank":
        with Player(player_id) as player:
            player.board_position += int(card_value) # CHECK TYPES
