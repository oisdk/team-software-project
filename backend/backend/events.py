"""
Handles the generation of Server-Sent Events which notify clients of state
changes.

Steps for adding more SSE on the SERVER SIDE:
    See README.rst in "team-software-project/backend"

Steps for adding more SSE listeners on the CLIENT SIDE:
    See README.md in "team-software-project/frontend"

"""
import sys
import time
import json
from cgi import FieldStorage
import cgitb
from backend.game import Game
from backend.player import Player
from backend.properties import owned_property_positions, Property

cgitb.enable()


def start_sse_stream(output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes.

    This function is activated by making a request to the JavaScript
    function "initialiseEventSource()" which is located in "sse.js".
    This operation is performed by the JavaScript waitingGame function,
    and hence, other JavaScript code need only "get" a reference to
    the EventSource object (by calling "getEventSource()" from
    "sse.js").

    Reads in the game id, and repeatedly does each of the following:
        1) Check whose turn it is.
        2) Check if any new players have joined the waiting game lobby.
        3) Check if any of the players' balances have changed in a game.
        4) Check if any of the players' positions have changed in a game.
        5) Check if the specified game's status has changed to "playing".

    """
    # The following headers are compulsory for SSE.
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    # Read in the game id from standard input (aka. FieldStorage) and create
    # an empty dictionary of current players, positions, balances, new
    # players, new positions, new balances and turn orders. All the "new"
    # dicts will be populated with the most up to date data from the
    # **database**, while non-"new" dicts will be populated only after a
    # comparison between it and the corresponding "new" dict has been made.
    input_data = FieldStorage()
    game_id = input_data.getfirst('game')
    last_game_state = "waiting"
    players = {}
    positions = {}
    balances = {}
    new_players = {}
    new_positions = {}
    new_balances = {}
    turn = None
    turn_order = {}
    jailed_players = {}
    new_jailed_players = {}
    push_initial_user_details = True

    # These statements are executed constantly once the first request to this
    # function is made.
    while True:
        # Create a Game object representing the game in the database.
        # This can be thought of as a "pointer" to the appropriate game in the
        # database.
        game = Game(game_id)

        # Go through each player in the game and populate the "new"
        # dictionaries with user_id (aka. player_id) as the key, and
        # username/position/balance/turn-order as the value.
        # These are the latest values retrieved from the database.
        for player in map(Player, game.players):
            new_players[player.uid] = player.username
            new_jailed_players[player.uid] = player.jail_state
            new_positions[player.uid] = player.board_position
            new_balances[player.uid] = player.balance
            turn_order[player.uid] = player.turn_position

        # Assign the current (aka. non-new) dictionaries to the value of the
        # "new" (aka. latest) dictionaries, after calling the appropriate
        # comparison function to determine whether an event should be
        # generated.
        turn = check_new_turn(output_stream, turn, game.current_turn,
                              turn_order)
        players = check_new_players(output_stream, players, new_players)
        balances = check_new_balances(output_stream, balances, new_balances)
        jailed_players = check_new_jailed_players(
            output_stream, jailed_players, new_jailed_players)
        positions = check_new_positions(output_stream, positions,
                                        new_positions, new_jailed_players)

        # Pushes data to update the players info table on game start
        if push_initial_user_details and last_game_state == "playing":
            push_initial_user_details = False
            start_game_push(output_stream, turn_order)

        # Call function to check the current state of this game.
        # A game state may be "waiting" or "playing".
        last_game_state = check_game_playing_status(output_stream, game,
                                                    last_game_state)

        time.sleep(3)

        # Flush standard out which forcefully sends everything that might be
        # buffered in standard out to the client. No need to worry about tech
        # details too much, it's just standard SSE procedure!
        output_stream.flush()


def output_event(output_stream, event, data):
    """Output a sse event as json with the given details.

    An SSE event consists of data and an optional name. The name is the
    identifier that is listened for on the client side (if no name is given,
    the event can be listened for as "message"). Here’s the rough format:

    [event: <event name>]
    data: <event data>
    [data: <continued event data>]
    <blank line>

    Arguments:
        output_stream: The stream to output the sse event to.
        event: The name of the event to output.
        data: The data to be output. This will be serialised using json.dumps.

    Testing strings:
    >>> import sys
    >>> output_event(sys.stdout, 'hello', 'goodbye')
    event: hello
    data: "goodbye"
    <BLANKLINE>

    Testing numbers:
    >>> import sys
    >>> output_event(sys.stdout, 'hello', 3)
    event: hello
    data: 3
    <BLANKLINE>

    Testing dictionaries:
    >>> import sys
    >>> output_event(sys.stdout, 'hello', {3: 4, 5: 'q'})
    event: hello
    data: {"3": 4, "5": "q"}
    <BLANKLINE>

    Testing lists:
    >>> import sys
    >>> output_event(sys.stdout, 'hello', [3, 4, 5, 4])
    event: hello
    data: [3, 4, 5, 4]
    <BLANKLINE>
    """
    output_stream.write(
        'event: {}\n'
        'data: {}\n'
        '\n'.format(event, json.dumps(data, sort_keys=True)))


def check_new_turn(output_stream, old_turn, new_turn, turn_order):
    """Checks if the turn has changed to a different player and sends an SSE
    event if it has.

    Arguments:
        old_turn: An int representing the current position in the playing
            queue.
        new_turn: An int representing the latest (aka. "new") position in the
            playing queue.
        turn_order: A dictionary representing mapping player ids to the
            player's position in the playing queue.

    Returns:
        An int representing the current position of the playing queue.

    """
    if new_turn != old_turn:
        for uid, turn_pos in turn_order.items():
            if turn_pos == new_turn:
                player = Player(uid)
                output_event(
                    output_stream,
                    'playerTurn',
                    {'name': player.username, 'id': player.uid})
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
    return new_players.copy()


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
    if not old_players:
        data = [uname for uid, uname in new_players.items()]
    else:
        data = [
            uname
            for uid, uname in new_players.items()
            if uid not in old_players]
    output_event(output_stream, 'playerJoin', data)


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
    return new_balances.copy()


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
    data: [[8, 400, 200]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_balance_event(
    ...     sys.stdout,
    ...     {},
    ...     {5: 200})
    event: playerBalance
    data: [[5, 200, 0]]
    <BLANKLINE>

    >>> generate_player_balance_event(
    ...     sys.stdout,
    ...     {3: 100},
    ...     {5: 200, 3: 100})
    event: playerBalance
    data: [[5, 200, 0]]
    <BLANKLINE>
    """
    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    data = []
    for uid, balance in new_balances.items():
        if uid in old_balances:
            old = old_balances[uid]
            if old != balance:
                data.append([uid, balance, balance - old])
        else:
            data.append([uid, balance, 0])

    output_event(output_stream, 'playerBalance', data)


def check_new_positions(output_stream, old_positions, new_positions,
                        jailed_players):
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
        generate_player_move_event(output_stream, old_positions,
                                   new_positions, jailed_players)
    return new_positions.copy()


def generate_player_move_event(output_stream, old_positions, new_positions,
                               jailed_players):
    """Generates an event for a change in the position of players in the game.

    Compares two dictionaries and outputs a playerMove server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.

    Arguments:
        old_positions: A dictionary representing the current position for each
            player.
        new_players: A dictionary representing the latest position for each
            player.
        jailed_players: A dictionary representing the jailed players.

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {5: 4, 6: 6, 7: 5, 8: 0},
    ...     {5: 4, 6: 6, 7: 5, 8: 4},
    ...     {8: 'in_jail'})
    event: playerMove
    data: [[8, 4, 0, "in_jail"]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {},
    ...     {5: 4},
    ...     {})
    event: playerMove
    data: [[5, 4, 0, "not_in_jail"]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_move_event(
    ...     sys.stdout,
    ...     {3: 10},
    ...     {5: 4, 3: 10},
    ...     {})
    event: playerMove
    data: [[5, 4, 0, "not_in_jail"]]
    <BLANKLINE>
    """
    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    data = []
    for uid, new_position in new_positions.items():
        if uid not in old_positions:
            data.append([uid, new_position, 0, 'not_in_jail'])
        else:
            old_position = old_positions[uid]
            if old_position != new_position:
                if uid not in jailed_players:
                    jailed = 'not_in_jail'
                else:
                    jailed = jailed_players[uid]
                data.append([uid, new_position, old_position, jailed])

    output_event(output_stream, 'playerMove', data)


def check_game_playing_status(output_stream, game, last_game_state):
    """Check if the specified game's status is 'playing'.

    Arguments:
        game: The game whose status is being checked.

    """
    if last_game_state == "waiting" and game.state == "playing":
        # Call function to generate appropriate event if game's status is
        # "playing".
        generate_game_start_event(game.uid, output_stream)

    return game.state


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
    """
    output_event(output_stream, 'gameStart', game_id)


def check_property_ownership(output_stream, game_id, old_properties):
    """Issue events if the ownership of any properties has changed.

    Arguments:
        game_id: The id of the game the events are being issued for.

    Returns:
        The current property ownership data, as a dictionary where the keys
        are property positions, and the values are owner player ids.
    """
    positions = owned_property_positions(game_id)
    new_properties = {}
    for position in positions:
        this_property = Property(position, game_id)
        new_properties[position] = this_property.owner
    if old_properties != new_properties:
        generate_ownership_events(
            output_stream,
            old_properties,
            new_properties)
    return new_properties


def generate_ownership_events(
        output_stream,
        old_ownership,
        new_ownership):
    """Generate an event for properties that have changed owner.

    Include properties that have become owned or unowned.

    Arguments:
        output_stream: The stream to which the events will be written.
        old_ownership: The old ownership data, as a dictionary where the keys
            are property ids and the values are dictionaries which have
            'name' and 'owner' fields, containing the property name and the
            owner username respectively.
        new_ownership: The new ownership data, in the same format as
            old_ownership.

    >>> import sys
    >>> generate_ownership_events(
    ...     sys.stdout,
    ...     {
    ...         1: {'name': 'p1', 'owner': 'u2'},
    ...         4: {'name': 'p4', 'owner': 'u7'}
    ...     },
    ...     {
    ...         1: {'name': 'p1', 'owner': 'u2'},
    ...         4: {'name': 'p4', 'owner': 'u6'}
    ...     })
    event: propertyOwnerChanges
    data: [{"newOwner": "u6", "oldOwner": "u7", "property": "p4"}]
    <BLANKLINE>

    >>> import sys
    >>> generate_ownership_events(
    ...     sys.stdout,
    ...     {
    ...         4: {'name': 'p4', 'owner': 'u7'}
    ...     },
    ...     {
    ...         1: {'name': 'p1', 'owner': 'u2'},
    ...         4: {'name': 'p4', 'owner': 'u7'}
    ...     })
    event: propertyOwnerChanges
    data: [{"newOwner": "u2", "oldOwner": null, "property": "p1"}]
    <BLANKLINE>

    >>> import sys
    >>> generate_ownership_events(
    ...     sys.stdout,
    ...     {
    ...         1: {'name': 'p1', 'owner': 'u2'},
    ...         4: {'name': 'p4', 'owner': 'u7'}
    ...     },
    ...     {
    ...         4: {'name': 'p4', 'owner': 'u7'}
    ...     })
    event: propertyOwnerChanges
    data: [{"newOwner": null, "oldOwner": "u2", "property": "p1"}]
    <BLANKLINE>
    """
    changes = []
    positions = set(old_ownership.keys()).union(new_ownership.keys())
    for position in positions:
        if position in old_ownership and position in new_ownership:
            old_owner = old_ownership[position]['owner']
            new_owner = new_ownership[position]['owner']
            property_name = new_ownership[position]['name']
        elif position not in new_ownership:
            old_owner = old_ownership[position]['owner']
            new_owner = None
            property_name = old_ownership[position]['name']
        else:  # position not in old_ownership
            old_owner = None
            new_owner = new_ownership[position]['owner']
            property_name = new_ownership[position]['name']

        if old_owner != new_owner:
            changes.append({
                'newOwner': new_owner,
                'oldOwner': old_owner,
                'property': property_name})

    output_event(output_stream, 'propertyOwnerChanges', changes)


def check_new_jailed_players(output_stream,
                             jailed_players, new_jailed_players):
    """Checks if a player has been jailed and sends an SSE event if one has.

    Arguments:
        jailed_players: A dictionary representing the current jailed status
            for each player. key = user_id, value = status.
        new_jailed_players: A dictionary representing the latest
            jailed status for each player. key = user_id, value = status.

    Returns:
        A dictionary with the latest jailed state for each player.

    """
    if new_jailed_players != jailed_players:
        generate_player_jailed_event(
            output_stream, jailed_players, new_jailed_players)
    return new_jailed_players.copy()


def generate_player_jailed_event(
        output_stream, jailed_players, new_jailed_players):
    """Generates an event for a change of jailed players in the game.

    Compares two dictionaries and outputs a playerJailed server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.

    Arguments:
        jailed_players: A dictionary representing the
            current jailed state for each player.
        new_jailed_players: A dictionary representing
             the latest jailed state for each player.

    >>> import sys
    >>> generate_player_jailed_event(
    ...     sys.stdout,
    ...     {5: 'not_in_jail', 6: 'not_in_jail'},
    ...     {5: 'not_in_jail', 6: 'in_jail'})
    event: playerJailed
    data: [[6, "in_jail"]]
    <BLANKLINE>

    >>> import sys
    >>> generate_player_jailed_event(
    ...     sys.stdout,
    ...     {},
    ...     {6: 'not_in_jail'})
    event: playerJailed
    data: [[6, "not_in_jail"]]
    <BLANKLINE>

    """
    # Send the event name to the client.
    output_stream.write('event: playerJailed\n')

    # Send the JSON object which contains the elements that are not in common
    # with the two dictionaries.
    output_stream.write('data: ')

    if not jailed_players:
        output_stream.write(json.dumps([
            [uid, state]
            for uid, state in new_jailed_players.items()]))
    else:
        output_stream.write(json.dumps([
            [uid, state]
            for uid, state in new_jailed_players.items()
            if state != jailed_players[uid]]))

    # Standard SSE procedure to have two blank lines after data.
    output_stream.write('\n\n')


def start_game_push(output_stream, turn_order):
    """Generates an event for to update the details table at game start.

    Compares two dictionaries and outputs a playerBalance server-sent event if
    the two dicts differ. Along with the event is JSON containing the
    difference between the two dicts.
    """
    generate_player_turn_event(output_stream, next(iter(turn_order)),
                               turn_order)
    generate_player_balance_event(output_stream, {},
                                  {1: 1500, 2: 1500, 3: 1500, 4: 1500})
