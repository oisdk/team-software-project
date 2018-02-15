"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys
import time
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
    positions = {}
    turn = None
    balances = {}

    new_players = {}
    new_positions = {}
    new_balances = {}

    while True:
        game = Game(game_id)

        for player in map(Player, game.players):
            new_players[player.uid] = player.username
            new_positions[player.uid] = player.board_position
            new_balances[player.uid] = player.balance

        new_turn = game.current_turn

        if new_turn != turn:
            generate_player_turn_event(output_stream, new_turn)
            turn = new_turn

        if new_players != players:
            generate_player_join_event(output_stream, players, new_players)
            players = new_players

        if new_positions != positions:
            generate_player_move_event(output_stream, positions, new_positions)
            positions = new_positions

        if new_balances != balances:
            generate_player_balance_event(output_stream, balances,
                                          new_balances)
            balances = new_balances

        time.sleep(3)
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


def generate_player_turn_event(output_stream, new_turn):
    """Generates an event for a change of turn in the game.

    >>> import sys
    >>> generate_player_turn_event(sys.stdout, 2)
    event: playerTurn
    data: 2
    <BLANKLINE>
    """
    output_stream.write('event: playerTurn\n')
    output_stream.write('data: ' + str(new_turn))
    output_stream.write('\n\n')


def generate_player_balance_event(output_stream, old_balances, new_balances):
    """Generates an event for a change in the balance of players in the game.

    >>> import sys
    >>> generate_player_balance_event(
    ...     sys.stdout,
    ...     {5: 200, 6: 200, 7: 200, 8: 200},
    ...     {5: 200, 6: 200, 7: 200, 8: 400})
    event: playerBalance
    data: [[8, 400]]
    <BLANKLINE>
    """
    output_stream.write('event: playerBalance\n')
    output_stream.write('data: ')
    output_stream.write(json.dumps([
        [uid, balance]
        for uid, balance in new_balances.items()
        if balance != old_balances[uid]]))
    output_stream.write('\n\n')
