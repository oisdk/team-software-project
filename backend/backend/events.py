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
    balances = {}
    new_players = {}
    new_positions = {}
    new_balances = {}
    turn = None
    turn_order = {}

    while True:
        game = Game(game_id)

        for player in map(Player, game.players):
            new_players[player.uid] = player.username
            new_positions[player.uid] = player.board_position
            new_balances[player.uid] = player.balance
            turn_order[player.uid] = player.turn_position

        turn = check_new_turn(output_stream, turn, game.current_turn,
                              turn_order)
        players = check_new_players(output_stream, players, new_players)
        balances = check_new_balances(output_stream, balances, new_balances)
        positions = check_new_positions(output_stream, positions,
                                        new_positions)

        time.sleep(3)
        output_stream.flush()


def check_new_turn(output_stream, old_turn, new_turn, turn_order):
    """Checks if the turn has changed to a different player and sends an SSE
    event if it has.
    """
    if new_turn != old_turn:
        for uid, turn_pos in turn_order.items():
            if turn_pos == new_turn:
                generate_player_turn_event(output_stream, new_turn, uid)
    return new_turn


def check_new_players(output_stream, old_players, new_players):
    """Checks if a new player joined the game and sends an SSE event if it has.
    """
    if new_players != old_players:
        generate_player_join_event(output_stream, old_players, new_players)
    return new_players


def check_new_balances(output_stream, old_balances, new_balances):
    """Checks if a players balance changed and sends an SSE event if it has."""
    if new_balances != old_balances:
        generate_player_balance_event(output_stream, old_balances,
                                      new_balances)
    return new_balances


def check_new_positions(output_stream, old_positions, new_positions):
    """Checks if a player has moved and sends an SSE event if it has."""
    if new_positions != old_positions:
        generate_player_move_event(output_stream, old_positions, new_positions)
    return new_positions


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


def generate_player_turn_event(output_stream, new_turn, player_id):
    """Generates an event for a change of turn in the game.

    >>> import sys
    >>> generate_player_turn_event(sys.stdout, 2, 1)
    event: playerTurn1
    data: 2
    <BLANKLINE>
    """
    output_stream.write('event: playerTurn%s\n' % player_id)
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
