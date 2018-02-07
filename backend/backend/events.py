"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys


def start_sse_stream(input_stream=sys.stdin, output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes."""
    game_id = read_game_id(input_stream)
    game_state = None

    while True:
        new_game_state = game_state(game_id)
        state_changes = game_state_changes(game_state, new_game_state)
        if state_changes:
            output_events(data=state_changes, output_stream=output_stream)
            output_stream.flush()
            game_state = new_game_state

def read_game_id(input_stream):
    """Read a game id from the input stream and return it."""
    request = json.load(input_stream)
    return request['game_id']

def game_state(game_id):
    """Get the state for a particular game."""
    return {}

def game_state_changes(old_state, new_state):
    """Determine what’s changed between the old state and the new state."""
    return {key: new_state[key]
        for key in old_state
        if key not in old_state
        or new_state[key] != old_state[key]}
