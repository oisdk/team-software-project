"""Module providing functionality to retrieve a list
   of results of mortgage or unmortgage properties from
   the database.
"""

from backend.properties import get_properties_by_state


def get_un_mortgage(player_id, prop_state):
    """Requesting list of player_id owned (un)mortgaged
    properties.
    Returns {player_id: [state, [list of properties]]}
    """
    return get_properties_by_state(player_id, prop_state)
