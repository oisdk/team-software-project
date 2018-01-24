"""Enables polling the server for updates."""

import json
import sys
import cgitb

cgitb.enable()

def get_state_update(input=sys.stdin, output=sys.stdout):
    """Respond to client requests with the current state."""
    output.write('Content-Type: application/json\n\n')
    json.dump({"your_turn": True}, output)
