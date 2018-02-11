""" Roll die module """
from random import randint
from backend.player import Player
from backend.game import Game
import json
import sys


def roll_dice():

    """Function that returns a number between 1 and 6
       to represent the numbers of a die.
    """
    return randint(1, 6)


def roll_two_dice():
    """Simulates the rolling of two 6-sided dice.

    Returns:
        An int tuple representing the result of the two dice rolls.

    """
    dice_result = (roll_dice(), roll_dice())
    return dice_result


def player_roll_dice(source=sys.stdin):
    """Rolls two dice for a player, appends there rolls to the database,
       updates their position and the current game turn.
    """

    request = json.load(source)
    player_id = request["user_id"]
    game_id = request["game_id"]

    number_of_squares = 40
    pass_go_amount = 200

    with Game(game_id) as game:
        with Player(player_id) as player:
            if game.current_turn == player.turn_position:
                rolls = roll_two_dice()
                player.rolls.append(rolls)
                player.board_position += sum(rolls)

                if player.board_position >= number_of_squares:
                    player.balance += pass_go_amount
                    player.board_position -= number_of_squares

                if rolls[0] != rolls[1]:
                    if game.current_turn == len(game.players)-1:
                        game.current_turn = 0
                    else:
                        game.current_turn += 1
