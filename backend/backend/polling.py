"""Enables polling the server for updates."""

import json
import sys
import cgitb

cgitb.enable()

def check_turn(input=sys.stdin, output=sys.stdout):
    """Lets the client know whether it’s its turn or not."""
    output.write('Content-Type: application/json\n\n')
    json.dump({"your_turn": True}, output)
