"""Various tests that use the database.

Intended to be run directly on the server or local Docker image.
"""


def create_test_game(usernames):
    """Creates a test game containing the given players.

    Also adds those players to the database.

    Arguments:
        usernames: A list of players to add to the game.

    Returns:
        game_id, player_ids: The id of the created game, and a list of the ids
            of the players in the game.
    """
    from backend.game import create_game
    from backend.player import create_player
    from backend.join_game import add_player

    player_ids = [create_player(username) for username in usernames]
    game_id = create_game(player_ids[0])
    for player in player_ids[1:]:
        add_player(player, game_id)
    return game_id, player_ids


def test_create_game(players):
    """Tests creating a game with 4 players.

    Arguments:
        players: A list of usernames for players to add to the game.
    """
    from backend.game import Game
    from backend.player import Player
    game_id, player_ids = create_test_game(players)
    print('Created game with id {}'.format(game_id))
    game = Game(game_id)
    print('Game object has player ids: {}'.format(game.players))
    players = [Player(p) for p in player_ids]
    return game, players


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
    from backend.player import Player
    with Player(user) as player:
        print("Player's balance was initially {}".format(player.balance))
    buy_property_db(game, user, position)
    with Property(position, game) as prop:
        print(
            "Property's state should be 'owned'"
            ' and is: {}'.format(prop.property_state))
        print(
            "Player's balance should have reduced by {}"
            .format(prop.price)
        )
        with Player(user) as player:
            print("Player's balance is now {}".format(player.balance))


def test_player_remove(game, player):
    """Tests removing a player from a game.

    Arguments:
        game: The Game object for the game to remove a player from.
        player: The Player object for the player to remove.
    """
    from backend.is_bankrupt import player_remove
    print('Game has players: {}'.format(game.players))
    print('Removing ({}: {}) from game:'.format(player.uid, player.username))
    player_remove(player)
    print('Game has players: {}'.format(game.players))


def test_game_end(game, players):
    """Tests that removing all but one player from a game finishes it.

    Arguments:
        game: The Game object to test.
        players: A list of Player objects for the players in the game.
    """
    players = players.copy()
    while len(players) > 1:
        test_player_remove(game, players.pop())

    print('Game state should be "finished": {}'.format(game.state))


def main():
    """Creates a test game with some players and starts it."""
    from backend.properties import owned_property_positions
    game, players = test_create_game(['Alex', 'Beth', 'Fred', 'Eimear'])
    test_start_game(game)
    test_buy_property(game.uid, game.players[0], 1)
    test_buy_property(game.uid, game.players[1], 31)
    test_buy_property(game.uid, game.players[2], 9)
    test_buy_property(game.uid, game.players[3], 8)
    positions = owned_property_positions(game.uid)
    print('Owned properties: {}'.format(positions))
    test_game_end(game, players)


if __name__ == '__main__':
    main()
