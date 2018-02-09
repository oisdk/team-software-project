"""
Handles the generation of Server-Sent Events which notify clients of state
changes.
"""
import sys
import json
import backend.storage as storage


def start_sse_stream(input_stream=sys.stdin, output_stream=sys.stdout):
    """Generate a stream of server-sent events according to state changes."""
    output_stream.write('Content-Type: text/event-stream\n')
    output_stream.write('Cache-Control: no-cache\n')
    output_stream.write('\n')

    game_id = json.load(input_stream)['game_id']
    game_state = None
    players = None

    while True:
        game = Game(game_id)
        new_game_state = game.state
        new_players = game.players

        if new_players != players:
            output_stream.write('event: playerJoin\n')
            output_stream.write('data: ')
            output_stream.write(json.dumps({'playerIds': new_players}))
            output_stream.write('\n\n')
            players = new_players

        if (game_state == None
            or new_game_state == 'active' and game_state == 'waiting'):
            output_stream.write('event: gameStart\n\n')
            game_state = new_game_state

        output_stream.flush()
