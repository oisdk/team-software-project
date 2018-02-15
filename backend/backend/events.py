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
    """Generate a stream of server-sent events according to state changes.

    Reads in the game id, and does both of the following:
    1) Check if any new players have joined the waiting game lobby
    2) Check if any waiting games have been started

    """
    # The following headers are compulsory for SSE.
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    # Read in the game id from standard input (aka. FieldStorage) and create an
    # empty dictionary of current players.
    input_data = FieldStorage()
    game_id = input_data.getfirst('game')
    players = {}

    # These statements are executed constantly once the first request to this
    # file is made.
    while True:
        # Create a Game object representing the game in the database.
        # This can be thought of as a "pointer" to the appropriate game in the
        # database.
        game = Game(game_id)

        # Create a dictionary mapping all the game's players' user ids to their
        # usernames. The reason the dictionary is called new_players is because
        # whatever is in the database will of course be the most recent line-up
        # of players.
        new_players = {
            player.uid: player.username
            for player in map(Player, game.players)
        }

        # Check if the current players dictionary (which was created outside this
        # while-loop) is different to the new_players dictionary (containing the
        # most recent lot of players retrieved from the database). If the two
        # dicts are different, then a new player must have joined since we last
        # polled the database.
        if new_players != players:
            # Call function to generate server-sent event
            generate_player_join_event(output_stream, players, new_players)
            # Assign the most up to date dictionary of players retrieved from the
            # database to the dictionary of "current" players
            players = new_players

        # Call function to check if any games in the database have a "playing"
        # status.
        check_for_playing_games(output_stream)

        # Flush standard out which forcefully sends everything that might be
        # buffered in standard out to the client. No need to worry about tech
        # details too much, it's just standard SSE procedure!
        output_stream.flush()


def generate_player_join_event(output_stream, old_players, new_players):
    """Generates an event for a change in the group of players in the game.

    Compares two dictionaries and outputs a playerJoin server-sent event if
    the two dicts differ. Along with the event is JSON containing the difference
    between the two dicts.

    Arguments:
        old_players: A dictionary representing the current list of players.
        new_players: A dictionary representing the latest list of players in DB.

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
