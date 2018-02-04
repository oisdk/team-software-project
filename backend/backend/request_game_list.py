"""Module providing functionality to retrieve a list
   of results for available games from the database.

"""

import sys
import json
import cgitb
from backend.get_list_of_games import get_list_of_games


cgitb.enable()


def request_game_list(output=sys.stdout):
    """Entry point for the service of requesting list of available games

    >>> import io
    >>> out = io.StringIO()
    >>> request_game_list(out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"game_id": "game_representation", "game_id": .....}
    """

    output.write('Content-Type: application/json\n\n')
    # result holds game id as the key and the value as the
    # game object representation
    result = {str(game.get_game_id()): str(game) for game in get_list_of_games()}
    json.dump(result, output)
