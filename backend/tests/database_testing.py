"""Various tests that use the database.

Intended to be run directly on the server or local Docker image.
"""

def create_test_game(usernames):
    """Creates a test game containing the given players.

    Also adds those players to the database.

    Arguments:
        usernames: A list of players to add to the game.
    """
    from backend.game import create_game
    from backend.player import create_player
    player_ids = [create_player(username) for username in usernames]
    game_id = create_game(player_ids[0])
