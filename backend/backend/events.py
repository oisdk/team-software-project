"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys
import json
from cgi import FieldStorage
import cgitb
from backend.game import Game
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