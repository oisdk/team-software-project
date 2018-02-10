"""Module providing functionality to update an existing
   game's state.
"""


import json
import sys
import cgitb
import backend.storage


cgitb.enable()


def start_game(source=sys.stdin):
    """Updates a requested game's state to 'playing' by
       its game id.
    """
    request = json.load(source)
    game_id = request["game_id"]
    try:
        conn = backend.storage.make_connection()
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('UPDATE `games` '
                           'SET `state` = %s'
                           'WHERE `id` = %s;',
                           ('playing', game_id))
    finally:
        conn.close()
