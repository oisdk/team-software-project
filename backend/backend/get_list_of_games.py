"""Get list of existing games module"""

def get_list_of_games(storage):
    """Function that retrieves games from storage

    Returns:
        A list of the game objects available for client to join

    """

    listOfGames = []

    for games in storage:
        listOfGames += [games]
    return listOfGames
