"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys
import json
from cgi import FieldStorage
import cgitb
from backend.game import Game
from backend.game import get_games
from backend.player import Player

cgitb.enable()


def start_sse_stream(output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes."""
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    input_data = FieldStorage()
    game_id = input_data.getfirst('game')
    players = {}

    while True:
        game = Game(game_id)
        new_players = {
            player.uid: player.username
            for player in map(Player, game.players)
        }

        if new_players != players:
            generate_player_join_event(output_stream, players, new_players)
            players = new_players

        check_for_playing_games(output_stream)

        output_stream.flush()


def generate_player_join_event(output_stream, old_players, new_players):
    """Generates an event for a change in the group of players in the game.

    >>> import sys
    >>> generate_player_join_event(
    ...     sys.stdout,
    ...     {5: 'first_user', 6: 'user_2'},
    ...     {5: 'first_user', 6: 'user_2', 8: 'third'})
    event: playerJoin
    data: ["third"]
    <BLANKLINE>
    """
    output_stream.write('event: playerJoin\n')
    output_stream.write('data: ')
    output_stream.write(json.dumps([
        uname
        for uid, uname in new_players.items()
        if uid not in old_players]))
    output_stream.write('\n\n')


def check_for_playing_games(output_stream):
    """ Check for games whose status is 'playing'. """
    list_of_games_in_db = list(get_games().keys())
    for game_id in list_of_games_in_db:
        game_reference = Game(game_id)
        if game_reference.state == "playing":
            generate_game_start_event(game_id, output_stream)


def generate_game_start_event(game_id, output_stream):
    """Generate a gameStart event for the appropriate game.

    >>> import sys
    >>> generate_game_start_event(5, sys.stdout)
    event: gameStart
    data: 5
    <BLANKLINE>
    <BLANKLINE>

    """
    output_stream.write('event: gameStart\n')
    output_stream.write('data: %i\n' % (game_id))
    output_stream.write('\n\n')
