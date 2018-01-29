"""Turn-related logic."""
# import cgitb
# cgitb.enable()

import time
import sys

def send_turn_notifications():
    print('Content-Type: text/event-stream')
    print('Cache-Control: no cache')
    print()
    while True:
        print('event: fuck')
        print('data: It’s your turn!')
        print()

        sys.stdout.flush()
