"""
Dummy implementation of python function to get details of a specific game.
"""
import json


def get_game_details(game_id):
    """Get the details for a game given its ID."""
    print('Content-type: application/json; charset=UTF-8')
    print()
    print(json.dumps({'gameData': {'id': game_id}}))
