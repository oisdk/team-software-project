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


def test_create_game(players):
    """Tests creating a game with 4 players.

    Arguments:
        players: A list of usernames for players to add to the game.
    """
    from backend.game import Game
    game_id = create_test_game(players)
    print('Created game with id {}'.format(game_id))
    game = Game(game_id)
    print('Game object has player ids: {}'.format(game.players))
    return game


def test_start_game(game):
    """Tests starting a game.

    Arguments:
        game: The Game object to try to start.
    """
    from backend.start_game import start_game_db
    start_game_db(game.uid)
    print("Game's status should be 'playing':")
    print("Game's status is {}".format(game.state))


def test_buy_property(game, user, position):
    """Tests buying a property.

    Arguments:
        game: The id of the game to buy a property in.
        user: The id of the user to buy the property for.
        position: The position of the property to buy.
    """
    from backend.properties import buy_property_db, Property
    buy_property_db(game, user, position)
    with Property(position, game) as prop:
        print(
            "Property's state should be 'owned'"
            ' and is: {}'.format(prop.property_state))


def main():
    """Creates a test game with some players and starts it."""
    game = test_create_game(['Alex', 'Beth', 'Fred', 'Eimear'])
    test_start_game(game)
    test_buy_property(game.uid, game.players[0], 1)


if __name__ == '__main__':
    main()
