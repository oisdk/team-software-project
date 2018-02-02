"""Get list of existing games module"""


from backend.game import Monopoly

# No persistance storage so making mock existing games and storing
# in a list as a mock storage"""
GAME_ONE = Monopoly(1)
GAME_TWO = Monopoly(2)
STORAGE = [GAME_ONE, GAME_TWO]


def get_list_of_games():

    """Function that retrieves games from storage

    Returns:
        A list of the game objects available for client to join

    """

    list_of_games = []

    for games in STORAGE:
        list_of_games += [games]
    return list_of_games
