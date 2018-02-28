"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

from backend.properties import get_properties_by_state as get_prop


def get_un_mortgage(player_id, prop_state):
    """Requesting list of player_id owned (un)mortgaged
    properties.
    Returns {player_id: [state, [list of properties]]}
    """
    return {"player_id": [prop_state, [get_prop(player_id, prop_state)]]}
