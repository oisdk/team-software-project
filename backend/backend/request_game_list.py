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
    >>> inp = io.StringIO(json.dumps({'games': 'list of games'}))
    >>> out = io.StringIO()
    >>> request_game_list(inp,out)
    >>> out.seek(0)
    0
    >>> print(out.read()) # doctest: +ELLIPSIS
    Content-Type: application/json
    <BLANKLINE>
    {"games": game1, game2, game3,....}
    """

    # Asserting request to ensure the right program called this function
    output.write('Content-Type: application/json\n\n')
    json.dump({'games': get_list_of_games()}, output)
