"""Various tests that use the database.

Intended to be run directly on the server or local Docker image.
"""

def create_test_game(usernames):
    """Creates a test game containing the given players.

    Also adds those players to the database.

    Arguments:
        usernames: A list of players to add to the game.

    Returns:
        game_id: The id of the created game.
    """
    from backend.game import create_game
    from backend.player import create_player
    from backend.join_game import add_player

    player_ids = [create_player(username) for username in usernames]
    game_id = create_game(player_ids[0])
    for player in player_ids[1:]:
        add_player(player, game_id)
    return game_id

def test_create_game():
    """Tests creating a game with 4 players."""
    from backend.game import Game
    players = ['Kate', 'Beth', 'Alice', 'Naomi']
    game_id = create_test_game(players)
    print('Created game with id {}'.format(game_id))
    game = Game(game_id)
    print('Game object has player ids: {}'.format(game.players))


def main():
    """Creates a test game with some players."""

if __name__ == '__main__':
    main()
