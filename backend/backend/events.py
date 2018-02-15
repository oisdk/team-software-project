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
from backend.game import get_games
from backend.player import Player

cgitb.enable()


def start_sse_stream(output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes.

    Reads in the game id, and does both of the following:
    1) Check if any new players have joined the waiting game lobby
    2) Check if any waiting games have been started

    """
    # The following headers are compulsory for SSE.
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    # Read in the game id from standard input (aka. FieldStorage) and create
    # an empty dictionary of current players.
    input_data = FieldStorage()
    game_id = input_data.getfirst('game')
    players = {}
    positions = {}
    balances = {}
    new_players = {}
    new_positions = {}
    new_balances = {}
    turn = None

    # These statements are executed constantly once the first request to this
    # file is made.
    while True:
        # Create a Game object representing the game in the database.
        # This can be thought of as a "pointer" to the appropriate game in the
        # database.
        game = Game(game_id)

        for player in map(Player, game.players):
            new_players[player.uid] = player.username
            new_positions[player.uid] = player.board_position
            new_balances[player.uid] = player.balance

        turn = check_new_turn(output_stream, turn, game.current_turn)
        players = check_new_players(output_stream, players, new_players)
        balances = check_new_balances(output_stream, balances, new_balances)
        positions = check_new_positions(output_stream, positions,
                                        new_positions)

        # Call function to check if any games in the database have a "playing"
        # status.
        check_for_playing_games(output_stream)

        time.sleep(3)

        # Flush standard out which forcefully sends everything that might be
        # buffered in standard out to the client. No need to worry about tech
        # details too much, it's just standard SSE procedure!
        output_stream.flush()


def check_new_turn(output_stream, old_turn, new_turn):
    """Checks if the turn has changed to a different player and sends an SSE
    event if it has.
    """
    if new_turn != old_turn:
        generate_player_turn_event(output_stream, new_turn)
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

    Compares two dictionaries and outputs a playerJoin server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.

    Arguments:
        old_players: A dictionary representing the current list of players.
        new_players: A dictionary representing the latest list of players.

    >>> import sys
    >>> generate_player_join_event(
    ...     sys.stdout,
    ...     {5: 'first_user', 6: 'user_2'},
    ...     {5: 'first_user', 6: 'user_2', 8: 'third'})
    event: playerJoin
    data: ["third"]
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerJoin\n')

    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    output_stream.write('data: ')
    output_stream.write(json.dumps([
        uname
        for uid, uname in new_players.items()
        if uid not in old_players]))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


def check_for_playing_games(output_stream):
    """Check for games whose status is 'playing'.

    Iterate over each game in the database and check to see if their status
    is equal to "playing".

    """
    # Get a list of game ids from the database.
    list_of_games_in_db = list(get_games().keys())

    # Iterate over each game_id in the list of games and check which one has a
    # status of "playing"
    for game_id in list_of_games_in_db:
        # Create a syntactic sugar Game instance to access the database.
        game_reference = Game(game_id)

        if game_reference.state == "playing":
            # Call function to generate appropriate event if game's status is
            # "playing".
            generate_game_start_event(game_id, output_stream)


def generate_game_start_event(game_id, output_stream):
    """Generate a gameStart event for the appropriate game.

    Sends a gameStart server-sent event, along with data representing the
    game_id.

    Arguments:
        game_id: An int representing the started game's id.

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
