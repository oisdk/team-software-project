"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

from backend.properties import get_properties_by_state


def get_un_mortgage(player_id):
    """Requests seperately mortgaged and unmortgaged properties
    owned by player.
    Returns {"unmortgage": [list of mortgaged properties],
             "mortgage": [list of unmortgaged properties]}
    """

    return {"unmortgage": get_properties_by_state(player_id, "mortgaged"),
            "mortgage": get_properties_by_state(player_id, "unmortgaged")}
