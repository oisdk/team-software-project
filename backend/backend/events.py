"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys
import json
import backend.storage as storage


def start_sse_stream(input_stream=sys.stdin, output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes."""
    game_id = read_game_id(input_stream)
    current_game_state = None
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    while True:
        new_game_state = game_state(game_id)
        try:
            state_changes = game_state_changes(
                current_game_state,
                new_game_state)
        except storage.DatabaseLookupError:
            output_stream.write('Content-type: text/plain\n')
            output_stream.write('\n')
            output_stream.write('The game could not be found.\n')
            break
        else:
            if state_changes:
                output_events(data=state_changes, output_stream=output_stream)
                output_stream.flush()
                current_game_state = new_game_state


def read_game_id(input_stream):
    """Read a game id from the input stream and return it.

    >>> import io
    >>> in_stream = io.StringIO(json.dumps({'game_id': 5}))
    >>> read_game_id(in_stream)
    5
    """
    request = json.load(input_stream)
    return request['game_id']


def game_state(game_id):
    """Get the state for a particular game.

    Returns an instance of the Monopoly class corresponding to the given game
    id, if it is found.

    Raises DatabaseLookupError if the game can’t be found.
    """
    return storage.retrieve_game(game_id)


def game_state_changes(old_state, new_state):
    """Determine what’s changed between the old state and the new state.

    Returns a dictionary containing:
        - any new values in new_state for keys already in old_state
        - any key-value pairs in new_state that aren’t in old_state
        - any key-value pairs in old_state that aren’t in new_state

    >>> game_state_changes(
    ...     old_state={'a': 1, 'b': 2, 'c': 3},
    ...     new_state={'a': 2, 'd': 5})
    {'a': 2, 'b': 2, 'c': 3, 'd': 5}
    """
    changes = {}
    changes.update(old_state)
    changes.update(new_state)
    return changes


def output_events(data, output_stream):
    """Output events for the given data.

    >>> import io
    >>> out_stream = io.StringIO()
    >>> data = {'players': ['a', 'b', 'c', 'd']}
    >>> output_events(data=data, output_stream=out_stream)
    >>> out_stream.seek(0)
    0
    >>> print(out_stream.read())
    event: gameUpdate
    data: {"players": ["a", "b", "c", "d"]}
    <BLANKLINE>
    """
    print('event: gameUpdate', file=output_stream)
    output_stream.write('data: {}'.format(json.dumps(data)))
    output_stream.write('\n')

class PropertySnapshot(object):
    """A static copy of an object’s properties."""
    def __init__(self, original):
        """Creates the snapshot by copying the property values of an object.

        Arguments:
            original: The object from which property values will be read.
        """
        for name in dir(original):
            value = getattr(original, name)
            if isinstance(value, property):
                setattr(self, name, value)
