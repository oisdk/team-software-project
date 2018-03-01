"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

import sys
import json
import cgitb

from backend.player import Player
from backend.properties import Property, get_position_by_name
from backend.get_un_mortgage import get_un_mortgage

cgitb.enable()


def property_state(source=sys.stdin):
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
    new_state = ""

    property_position = get_position_by_name(player_id, prop_name)
    game_id = get_propertys_gameid(player_id, property_position)

    with Property(property_position, game_id) as property_:
        with Player(player_id) as player:
            # Property_state is unmortgaged, now mortgaged
            if prop_state == "unmortgaged":
                player.balance += property_.price//2
                new_state = "mortgaged"
                property_.property_state = new_state
            elif prop_state == "mortgaged":
                player.balance -= property_.price//2
                new_state = "unmortgaged"
                property_.property_state = new_state


    # for displaying the mortgaged/ unmortgaged properties.
    json.dump(get_un_mortgage(player_id, prop_state), output)
