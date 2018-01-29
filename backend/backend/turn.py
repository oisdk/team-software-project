"""Turn-related logic."""
import cgitb
cgitb.enable()

import time
import sys
import json

def send_turn_notifications():
    print('Content-Type: text/event-stream')
    print('Cache-Control: no cache')
    print()
    while True:
        print('event: fuck')
        print('data: {}'.format(json.dumps({'yourTurn': True})))
        print()

        sys.stdout.flush()
        time.sleep(1)
