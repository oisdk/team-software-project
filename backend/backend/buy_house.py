"""Module enables players to purchase a
 house on properties of a given name"""
import sys
import json
import cgitb

from backend.player import Player
from backend.properties import Property, get_position_by_name
from backend.game import get_games

cgitb.enable()


def add_house(source=sys.stdin, output=sys.stdout):
    """Adds a house to a property.
    """
    request = json.load(source)
    player_id = request["player_id"]
    property_name = request["property_name"]
    game_id = None
    property_position = get_position_by_name(player_id, property_name)
    games = get_games()

    with Player(player_id) as player:
        for game in games:
            if player.username in games[game]:
                game_id = game
                break
        with Property(property_position, game_id) as prop:
            if prop.houses < 4:
                prop.houses += 1
            else:
                prop.houses = 0
                prop.hotels = 1
            player.balance -= prop.house_price

    output.write('Content-Type: application/json\n\n')
    json.dumps({"house_purchased": player_id}, output)
