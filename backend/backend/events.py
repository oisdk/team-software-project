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
    players = None
    positions = None
    turn = None

    while True:
        game = Game(game_id)
        new_players = {
            player.uid: player.username
            for player in map(Player, game.players)
        }

        new_positions = {
            player.uid: player.board_position
            for player in map(Player, game.players)
        }

        new_turn = game.current_turn

        if new_turn != turn:
            generate_player_turn_event(output_stream, turn, new_turn)
            turn = new_turn

        if new_players != players:
            generate_player_join_event(output_stream, players, new_players)
            players = new_players

        if new_positions != positions:
            generate_player_move_event(output_stream, positions, new_positions)
            positions = new_positions

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


def generate_player_move_event(output_stream, old_positions, new_positions):
    """Generates an event for a change in the position of players in the game.

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {5: 4, 6: 6, 7: 5, 8: 0},
    ...     {5: 4, 6: 6, 7: 5, 8: 4})
    event: playerMove
    data: [[8, 4]]
    <BLANKLINE>
    """
    output_stream.write('event: playerMove\n')
    output_stream.write('data: ')
    output_stream.write(json.dumps([
        [uid, board_position]
        for uid, board_position in new_positions.items()
        if board_position != old_positions[uid]]))
    output_stream.write('\n\n')


def generate_player_turn_event(output_stream, old_turn, new_turn):
    """Generates an event for a change in the position of players in the game.

    >>> import sys
    >>> generate_player_turn_event(sys.stdout, 1, 2)
    event: playerTurn
    data: 2
    <BLANKLINE>
    """
    output_stream.write('event: playerTurn\n')
    output_stream.write('data: ' + str(new_turn))
    output_stream.write('\n\n')
