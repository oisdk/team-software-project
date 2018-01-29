"""Turn-related logic."""
import cgitb
cgitb.enable()

import time
import sys
import json
import shelve

def send_turn_notifications():
    json_input = json.load(sys.stdin)
    username = json_input['username']
    create_user_entry(username)

    print('Content-Type: text/event-stream')
    print('Cache-Control: no cache')
    print()
    while True:
        print('event: fuck')
        print('data: {}'.format(json.dumps({'yourTurn': check_user_turn(username)})))
        print()

        sys.stdout.flush()
        time.sleep(1)

def create_user_entry(username):
    with shelve.open('turn_data') as turn_data:
        if turn_data == {}:
            turn_data[username] = True
        else:
            turn_data[username] = False

def check_user_turn(username):
    with shelve.open('turn_data') as turn_data:
        return turn_data[username]
