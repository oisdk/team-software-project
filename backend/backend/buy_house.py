import sys
import json
import cgitb

from backend.player import Player
from backend.properties import Property, get_property_by_name

cgitb.enable()


def add_house(source=sys.stdin, output=sys.stdout):
	request = json.load(source)
    player_id = request["player_id"]
    property_name = request["property_name"]
    game_id = None
    property_position = get_property_by_name(property_name)

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
    json.dump({"bought_house:" property_name}, output)
