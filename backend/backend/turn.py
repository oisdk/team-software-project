"""Turn-related logic."""
# import cgitb
# cgitb.enable()

import time

def send_turn_notifications():
    print('Content-Type: text/event-stream')
    print('Cache-Control: no cache')
    print()
    while True:
        print('data: It’s your turn!')
        time.sleep(5)
