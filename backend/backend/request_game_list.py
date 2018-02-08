"""Module providing functionality to retrieve a list
   of results for available games from the database.

"""

import sys
import json
import cgitb

import backend.game

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
    {...:...,...:...}
    """

    output.write('Content-Type: application/json\n\n')
    json.dump(backend.game.get_games(), output)
