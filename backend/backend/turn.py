"""Turn-related logic."""
import time
import sys
import json
import shelve
from collections import deque

import cgitb
cgitb.enable()

def send_turn_notifications():
    """Notify a client every second whose turn it is."""
    print('Content-Type: text/event-stream')
    print('Cache-Control: no cache')
    print()
    while True:
        print('event: turn')
        print('data: {}'.format(json.dumps({'activeTurn': get_user_turn()})))
        print()

        sys.stdout.flush()
        time.sleep(1)

def create_user_entry():
    """Add a user to the turn order."""
    json_input = json.load(sys.stdin)
    username = json_input['username']
    with shelve.open('turn_data') as turn_data:
        if turn_data == {}:
            # if there is no turn data yet, create a queue
            turn_data['order'] = deque()
        order = turn_data['order']
        order.append(username)
        turn_data['order'] = order
    print('Content-type: text/plain')
    print()
    print('Username registered.')

def get_user_turn():
    """Get the username of the player whose turn it is."""
    with shelve.open('turn_data') as turn_data:
        if 'order' in turn_data:
            return turn_data['order'][0]
        return None

def end_turn():
    """End the current turn."""
    with shelve.open('turn_data') as turn_data:
        order = turn_data['order']
        order.rotate(1)
        turn_data['order'] = order
    print('Content-type: text/plain')
    print()
    print('Turn ended.')
