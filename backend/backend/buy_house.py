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

        Takes a request from the client and adds a house
        to that property up to 4 houses then a hotel.
        After this it skips and does nothing.

        Arguments:
            player_id: the players id
            property_name: the properties name
        Returns:
            Dictionary with number of houses and property position
            keys = house,position

    """
    output.write('Content-Type: application/json\n\n')
    request = json.load(source)
    player_id = request["player_id"]
    property_name = request["property_name"]
    property_position = get_position_by_name(player_id, property_name)
    position = next(iter(property_position.values()))
    games = get_games()
    houses = None

    with Player(player_id) as player:
        for game in games:
            if player.username in games[game]:
                game_id = game
                break
        with Property(position, game_id) as prop:
            if prop.houses < 4 and prop.hotels == 0:
                prop.houses += 1
                houses = prop.houses
                player.balance -= prop.house_price
            elif prop.hotels == 0:
                prop.houses = 0
                prop.hotels = 1
                houses = 5
                player.balance -= prop.house_price
            else:
                pass

    json.dump({"house_number": houses, "property_position": position}, output)
