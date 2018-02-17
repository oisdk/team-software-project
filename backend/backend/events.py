"""
Handles the generation of Server-Sent Events which notify clients of state
changes.

Steps for adding more SSE on the SERVER SIDE:
    1) Write a new function that takes a meaningful argument (e.g. game) and
        performs some check in the database, see check_game_playing_status() for a
        straightforward example.
    2) If the 'check' within the function you have written above passes, it
        should calls another function which you will write which will generate
        an event for the client (have a look at generate_game_start_event()).
        Read the comments in generate_game_start_event below for some guidance
        regarding the sending of event types and the data payload.
    3) Finally, add the call to the function you wrote in 1) to
        start_sse_stream(). Make sure it's above the call to sleep(). Notice
        the call to check_game_playing_status() in start_sse_stream below.

Steps for adding more SSE listeners on the CLIENT SIDE:
    1) In your JavaScript code, add the following import statement:
        `
        import {initialiseEventSource} from './sse';
        `
    2) In your JavaScript code, create an event source:
        `
        const mySseEventSource = initialiseEventSource(gameID);
        `
    3) Now attach an event listener to the event source you just made:
        e.g.
        `
        mySseEventSource.addEventListener("gameStart", myCallback)
        `
        Note: The event "gameStart" depends on the name of the event that the
        server is sending to the client (i.e. For the other functions below,
        notice they're sending events like "playerMove" or "playerJoin").

    4) In your callback function, do whatever you want with the data that was
        send by the server.
        e.g.
        `
        mySseEventSource.addEventListener('...', (myEventData) => {
            const theData = myEventData.data;
            // Do something with 'theData'
        })
        `
        Notice that in some cases the server will send "data" in JSON
        (i.e. generate_player_join_event), therefore, you'll need to parse
        the "data" in the client code.
        e.g.
        `
        mySseEventSource.addEventListener('...', (myEventData) => {
            const theData = JSON.parse(myEventData.data);
            // Do something with 'theData'
        })
        `

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
    """Generate a stream of server-sent events according to state changes.

    Reads in the game id, and repeatedly does each of the following:
        1) Check what player's turn it is
        2) Check if any new players have joined the waiting game lobby.
        3) Check if any of the players' balances have changed in a game.
        4) Check if any of the players' positions have changed in a game.
        5) Check if any waiting games have been started.

    """
    # The following headers are compulsory for SSE.
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    # Read in the game id from standard input (aka. FieldStorage) and create
    # an empty dictionary of current players, positions, balances, new
    # players, new positions, and new balances. All the "new" dicts
    # will be populated with the most up to date data from the **database**,
    # while non-"new" dicts will be populated only after a comparison between
    # it and the corresponding "new" dict has been made.
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

        # Go through each player in the game (via the database) and populate
        # the "new" dictionaries with user_id (aka. player_id) as the key, and
        # username/position/balance as the value.
        for player in map(Player, game.players):
            new_players[player.uid] = player.username
            new_positions[player.uid] = player.board_position
            new_balances[player.uid] = player.balance

        # Assign the current (aka. non-new) dictionaries to the value of the
        # "new" (aka. "latest") dictionaries after calling the appropriate
        # comparison function to determine whether an event should be
        # generated.
        turn = check_new_turn(output_stream, turn, game.current_turn)
        players = check_new_players(output_stream, players, new_players)
        balances = check_new_balances(output_stream, balances, new_balances)
        positions = check_new_positions(output_stream, positions,
                                        new_positions)

        # Call function to check if any games in the database have a "playing"
        # status.
        check_game_playing_status(output_stream, game)

        time.sleep(3)

        # Flush standard out which forcefully sends everything that might be
        # buffered in standard out to the client. No need to worry about tech
        # details too much, it's just standard SSE procedure!
        output_stream.flush()


def check_new_turn(output_stream, old_turn, new_turn):
    """Checks if the turn has changed to a different player and sends an SSE
    event if it has.

    Arguments:
        old_turn: An int representing the current position in the playing
            queue.
        new_turn: An int representing the latest (aka. "new") position in the
            playing queue.

    Returns:
        A dictionary with the latest position in the playing queue.

    """
    if new_turn != old_turn:
        generate_player_turn_event(output_stream, new_turn)
    return new_turn


def check_new_players(output_stream, old_players, new_players):
    """Checks if a new player joined the game and sends an SSE event if it has.

    Arguments:
        old_players: A dictionary representing the current list of players in
            the game. key = user_id, value = username.
        new_players: A dictionary representing the latest (aka. "new") list
            of players in the game. key = user_id, value = username.

    Returns:
        A dictionary with the latest list of players in the game.

    """
    if new_players != old_players:
        generate_player_join_event(output_stream, old_players, new_players)
    return new_players


def check_new_balances(output_stream, old_balances, new_balances):
    """Checks if a player's balance changed and sends an SSE event if it has.

    Arguments:
        old_balances: A dictionary representing the current balance
            for each player. key = user_id, value = balance.
        new_balances: A dictionary representing the latest (aka. "new")
            balance for each player. key = user_id, value = balance.

    Returns:
        A dictionary with the latest balance for each player.

    """
    if new_balances != old_balances:
        generate_player_balance_event(output_stream, old_balances,
                                      new_balances)
    return new_balances


def check_new_positions(output_stream, old_positions, new_positions):
    """Checks if a player has moved and sends an SSE event if it has.

    Arguments:
        old_positions: A dictionary representing the current position
            for each player. key = user_id, value = position.
        new_positions: A dictionary representing the latest (aka. "new")
            position for each player. key = user_id, value = position.

    Returns:
        A dictionary with the latest positions for each player.

    """
    if new_positions != old_positions:
        generate_player_move_event(output_stream, old_positions, new_positions)
    return new_positions


def check_game_playing_status(output_stream, game):
    """Check if the specified game's status is 'playing'.

    Arguments:
        game: The game whose status is being checked.

    """
    if game.state == "playing":
        # Call function to generate appropriate event if game's status is
        # "playing".
        generate_game_start_event(game.uid, output_stream)


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

    >>> import sys
    >>> generate_player_join_event(
    ...     sys.stdout,
    ...     {},
    ...     {5: 'first_user'})
    event: playerJoin
    data: ["first_user"]
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerJoin\n')

    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    output_stream.write('data: ')
    if not old_players:
        output_stream.write(json.dumps([
            uname
            for uid, uname in new_players.items()]))
    else:
        output_stream.write(json.dumps([
            uname
            for uid, uname in new_players.items()
            if uid not in old_players]))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


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
    # Send the event name to the client.
    output_stream.write('event: gameStart\n')

    # Send the game_id to the client in the SSE data chunk.
    output_stream.write('data: %s\n' % (game_id))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


def generate_player_move_event(output_stream, old_positions, new_positions):
    """Generates an event for a change in the position of players in the game.

    Compares two dictionaries and outputs a playerMove server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.

    Arguments:
        old_positions: A dictionary representing the current position for each
            player.
        new_players: A dictionary representing the latest position for each
            player.

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {5: 4, 6: 6, 7: 5, 8: 0},
    ...     {5: 4, 6: 6, 7: 5, 8: 4})
    event: playerMove
    data: [[8, 4]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {},
    ...     {5: 4})
    event: playerMove
    data: [[5, 4]]
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerMove\n')

    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    output_stream.write('data: ')
    if not old_positions:
        output_stream.write(json.dumps([
            [uid, board_position]
            for uid, board_position in new_positions.items()]))
    else:
        output_stream.write(json.dumps([
            [uid, board_position]
            for uid, board_position in new_positions.items()
            if board_position != old_positions[uid]]))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


def generate_player_turn_event(output_stream, new_turn):
    """Generates an event for a change of turn in the game.

    Arguments:
        new_turn: An int representing the latest position in the playing
            queue.

    >>> import sys
    >>> generate_player_turn_event(sys.stdout, 2)
    event: playerTurn
    data: 2
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerTurn\n')

    # Send the integer representing the latest position in the playing queue
    # to the client in the SSE data chunk.
    output_stream.write('data: ' + str(new_turn))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


def generate_player_balance_event(output_stream, old_balances, new_balances):
    """Generates an event for a change in the balance of players in the game.

    Compares two dictionaries and outputs a playerBalance server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.

    Arguments:
        old_balances: A dictionary representing the current balance for each
            player.
        new_balances: A dictionary representing the latest balance for each
            player.

    >>> import sys
    >>> generate_player_balance_event(
    ...     sys.stdout,
    ...     {5: 200, 6: 200, 7: 200, 8: 200},
    ...     {5: 200, 6: 200, 7: 200, 8: 400})
    event: playerBalance
    data: [[8, 400]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_balance_event(
    ...     sys.stdout,
    ...     {},
    ...     {5: 200})
    event: playerBalance
    data: [[5, 200]]
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerBalance\n')

    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    output_stream.write('data: ')

    if not old_balances:
        output_stream.write(json.dumps([
            [uid, balance]
            for uid, balance in new_balances.items()]))
    else:
        output_stream.write(json.dumps([
            [uid, balance]
            for uid, balance in new_balances.items()
            if balance != old_balances[uid]]))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')
