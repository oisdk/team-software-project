"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

import sys
import json
import cgitb

from backend.player import Player
from backend.properties import Property, get_position_by_name, \
                               get_propertys_gameid
from backend.get_un_mortgage import get_un_mortgage

cgitb.enable()


def property_state(source=sys.stdin, output=sys.stdout):
    """Entry point for the service of requesting list of player_id
    owned (un)mortgaged properties.
    Returns {player_id: [state, [list of properties]]}
    """

    output.write('Content-Type: application/json\n\n')
    request = json.load(source)

    # The initial state of the property wished to be changed
    prop_state = request["player_id"][0]
    prop_name = request["player_id"][1]
    player_id = request["player_id"][2]
    game_id = request["player_id"][3]

    # Change property state and player balance if prop_name
    # and prop_state isn't None. It means state for property
    # and player's balance is to be changed.
    if prop_name != "None" and prop_state != "None":

        # State desired to be changed to for a property
        change_state_to = "mortgage" if prop_state == "unmortgage" \
                                     else "unmortgage"

        # Retrieving the property position and gameID for property object
        property_position = get_position_by_name(player_id, prop_name)
        game_id = get_propertys_gameid(player_id, property_position)

        with Property(property_position, game_id) as property_:
            with Player(player_id) as player:
                # Property_state was unmortgaged, now mortgaged
                property_.property_state = change_state_to
                if change_state_to == "unmortgage":
                    player.balance -= property_.price//2
                elif change_state_to == "mortgage":
                    player.balance += property_.price//2

    # For displaying the mortgaged/ unmortgaged properties.
    json.dump(get_un_mortgage(player_id, game_id), output)
