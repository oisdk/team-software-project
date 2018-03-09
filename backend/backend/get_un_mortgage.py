"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

from backend.properties import get_properties_by_state, get_housable


def get_un_mortgage(player_id, game_id):
    """Requests seperately mortgaged and unmortgaged properties
    owned by player.
    Returns {"unmortgage": [list of mortgaged properties],
             "mortgage": [list of unmortgaged properties],
             "housable": [list of properties that can have houses]}
    """

    return {"unmortgage": get_properties_by_state(player_id, "mortgaged"),
            "mortgage": get_properties_by_state(player_id, "unmortgaged"),
            "housable": get_housable(player_id, game_id)}
