"""This module provides the Property class"""

from operator import itemgetter
from itertools import groupby

import backend.storage


class Property(object):  # pylint: disable=too-many-instance-attributes
    """A single property in monopoly. Refer to the Player class for how to
    access and mutate members."""
    def __init__(self, position, gid):
        self._gid = gid
        self._position = position
        self._in_context = False
        self._property_state = None
        self._houses = 0
        self._hotels = 0
        self._owner = None
        self._price = 0
        self._property_type = None
        self._base = 0
        self._house_price = 0
        self._one = 0
        self._two = 0
        self._three = 0
        self._four = 0
        self._hotel = 0
        self._conn = None

    def __enter__(self):
        self._in_context = True
        self._conn = backend.storage.make_connection()
        self._conn.begin()
        with self._conn.cursor() as cursor:
            cursor.execute('SELECT * FROM `properties` WHERE `game_id` = %s '
                           'AND `property_position` = %s; ',
                           (self._gid, self._position))
            result = cursor.fetchone()
            self._property_state = result['state']
            self._houses = result['house_count']
            self._hotels = result['hotel_count']
            self._owner = result['player_id']
            del result
            cursor.execute('SELECT * FROM `property_values` '
                           'WHERE `property_position` = %s;',
                           (self._position))
            result = cursor.fetchone()
            self._price = result['purchase_price']
            self._property_type = result['state']
            self._base = result['base_rent']
            self._house_price = result['house_price']
            self._one = result['one_rent']
            self._two = result['two_rent']
            self._three = result['three_rent']
            self._four = result['four_rent']
            self._hotel = result['hotel_rent']
            del result
        return self

    def __exit__(self, *exc):
        try:
            with self._conn.cursor() as cursor:
                cursor.execute('UPDATE `properties` '
                               'SET `player_id` = %s, '
                               '`state` = %s, '
                               '`house_count` = %s, '
                               '`hotel_count` = %s'
                               'WHERE `game_id` = %s '
                               'AND `property_position` = %s',
                               (self._owner, self._property_state,
                                self._houses, self._hotels, self._gid,
                                self._position))
            self._conn.commit()
        finally:
            self._in_context = False
            self._conn.close()

    def _request_property(self, table, field, attribute):
        """Helper function to implement requesting a property from
        the database.

        Arguments:
            table: The name of the table that should be queried for this
                attribute.
            field: The name of the table field that corresponds to this
                property.
            attribute: The name of the attribute used for this property.
        """
        if self._in_context:
            return getattr(self, attribute)
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    query_string = cursor.mogrify(
                        'SELECT %s FROM %s',
                        (field, table))
                    query_string += cursor.mogrify(
                        ' WHERE property_position = %s',
                        self._position)
                    if table == 'properties':
                        query_string += cursor.mogrify(
                            ' AND game_id = %s',
                            (self._gid))
                    cursor.execute(query_string)
                    return cursor.fetchone()[field]
            finally:
                conn.close()

    @property
    def property_state(self):
        """
        Returns:
            str: the state of the property, 'owned' or 'unowned'
        """
        return self._request_property(
            table='properties',
            field='state',
            attribute='_property_state')

    @property
    def houses(self):
        """
        Returns:
            int: the current number of houses on the property
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._request_property(
            table='properties',
            field='house_count',
            attribute='_houses')

    @property
    def hotels(self):
        """
        Returns:
            int: amount of hotels on the property
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._request_property(
            table='properties',
            field='hotel_count',
            attribute='_hotels')

    @property
    def owner(self):
        """
        Returns:
            int: the player id of the owner
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._request_property(
            table='properties',
            field='player_id',
            attribute='_owner')

    @property
    def price(self):
        """
        Returns:
            int: the cost to purchase the property
        """
        return self._request_property(
            table='property_values',
            field='house_price',
            attribute='_price')

    @property
    def type(self):
        """
        Returns:
            str: the type of property it is: property, railroad or utility
        """
        return self._request_property(
            table='property_values',
            field='state',
            attribute='_property_type')

    @property
    def rent(self):
        """
        Returns:
            int: the rent for landing on the property
        """
        multiplier = 1
        if (self._houses == 0) and (self._hotels == 0):
            attribute = '_base'
            field = 'base_rent'
            if self._is_in_monopoly:
                multiplier = 2
        elif self._houses == 1:
            attribute = '_one'
            field = 'one_rent'
        elif self._houses == 2:
            attribute = '_two'
            field = 'two_rent'
        elif self._houses == 3:
            attribute = '_three'
            field = 'three_rent'
        elif self._houses == 4:
            attribute = '_four'
            field = 'four_rent'
        elif self._hotels == 1:
            attribute = '_hotel'
            field = 'hotel_rent'

        return multiplier * self._request_property(
            table='property_values',
            field=field,
            attribute=attribute)

    @property
    def house_price(self):
        """
        Returns:
            int: The cost to put a house or hotel on the property
        """
        return self._request_property(
            table='property_values',
            field='house_price',
            attribute='_house_price')

    def _set_property(self, name, new_value):
        if self._in_context:
            setattr(self, '_' + name, new_value)
        else:
            raise TypeError('Must be within "with" statement to mutate the '
                            'Player class')

    @houses.setter
    def houses(self, houses):
        self._set_property('houses', houses)

    @hotels.setter
    def hotels(self, hotels):
        self._set_property('hotels', hotels)

    @owner.setter
    def owner(self, owner):
        self._set_property('owner', owner)

    def _is_in_monopoly(self):
        """
        Returns:
            boolean: Whether the property is part of an owned monopoly
        """
        is_monopoly = False
        if self._position in [1, 3]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`1`, `3`) ',
                               'GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [6, 8, 9]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`6`, `8`, `9`) ',
                               'GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [11, 13, 14]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`11`, `13`, `14`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [16, 18, 19]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`16`, `18`, `19`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [21, 23, 24]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`21`, `23`, `24`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [26, 27, 29]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`26`, `27`, `29`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [31, 32, 34]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`31`, `32`, `34`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        elif self._position in [37, 39]:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT COUNT(*) FROM `properties` ',
                               'WHERE `game_id` = %s ',
                               'AND `property_position` IN (`37`, `39`)',
                               ' GROUP BY player_id; ',
                               (self._gid))
                result = cursor.fetchone()
        if result[0] == 1:
            is_monopoly = True
        return is_monopoly


def owned_property_positions(game_id):
    """Return a list of positions of owned properties in a game. """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT property_position, player_id '
                           'FROM properties '
                           'WHERE game_id = %s '
                           'AND state = %s '
                           'ORDER BY player_id;', (game_id, 'unowned'))
            return {player_id: [entry['property_position'] for entry in row]
                    for player_id, row
                    in groupby(cursor.fetchall(), itemgetter('player_id'))}


def property_positions():
    """Get a list of board positions where there are properties

    Returns:
        A list representing the positions of all properties on the board.

    """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT property_position '
                           'FROM property_values;')
            result = [row["property_position"] for row in cursor.fetchall()]
        return result
    finally:
        conn.close()


def is_property_owned(property_position, game_id):
    """Check if a property is currently owned.

    Arguments:
        property_position: An int representing the property position on the
                           board.
        game_id: An int representing the game id of the game in question.

    Returns:
        A bool: True if property is owned, False otherwise.

    """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * '
                           'FROM properties '
                           'WHERE state = "owned" '
                           'AND property_position = %s '
                           'AND game_id = %s;', (property_position, game_id))

            return cursor.rowcount > 0
    finally:
        conn.close()


def get_properties(player_id):
    """Returns a dictionary where a key is the 'player_id' and the value
    is the list of the player's owned property's positions"""
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT `property_position` FROM `playing_in`'
                           'WHERE `player_id` = %s;', (player_id))
            result = {player_id: [row['property_position']
                                  for row in cursor.fetchall()]}
        conn.commit()
        return result
    finally:
        conn.close()
