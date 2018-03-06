"""Various tests that use the database.

Intended to be run directly on the server or local Docker image.
"""

def create_test_game(player_ids):
    """Creates a test game containing the specified players.

    Arguments:
        player_ids: A list of player ids to add to the game.
    """
    from backend.game import create_game
    game_id = create_game(player_ids[0])
