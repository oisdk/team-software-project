"""This module provides the Property class"""

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
            if self._property_type == 'property':
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

    @property
    def property_state(self):
        """
        Returns:
            str: the state of the property, 'owned' or 'unowned'
        """
        return self._property_state

    @property
    def houses(self):
        """
        Returns:
            int: the current number of houses on the property
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._houses

    @property
    def hotels(self):
        """
        Returns:
            int: amount of hotels on the property
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._hotels

    @property
    def owner(self):
        """
        Returns:
            int: the player id of the owner
        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return self._owner

    @property
    def price(self):
        """
        Returns:
            int: the cost to purchase the property
        """
        return self._price

    @property
    def type(self):
        """
        Returns:
            str: the type of property it is: property, railroad or utility
        """
        return self._property_type

    @property
    def rent(self):
        """
        Returns:
            int: the rent for landing on the property
        """
        rent = 0
        if self.type == 'property':
            if (self._houses == 0) and (self._hotels == 0):
                if self._is_in_monopoly:
                    rent = self._base*2
                else:
                    rent = self._base
            elif self._houses == 1:
                rent = self._one
            elif self._houses == 2:
                rent = self._two
            elif self._houses == 3:
                rent = self._three
            elif self._houses == 4:
                rent = self._four
            elif self._hotels == 1:
                rent = self._hotel
        elif self.type == 'railroad':
            rent = 25 * (2 ** (self.rails_owned()-1))
        elif self.type == 'utility':
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT `roll1`, `roll2`, MAX(`num`)',
                               'FROM `rolls` ',
                               'WHERE `id` = %s GROUP BY `num`;',
                               (self._owner,))
                result = cursor.fetchone()
                roll = result['roll1'] + result['roll2']
                multiplier_type = self.utils_owned()
                rent = roll * 4 * multiplier_type
                del result
        return rent

    @property
    def house_price(self):
        """
        Returns:
            int: The cost to put a house or hotel on the property
        """
        return self._house_price

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

    def rails_owned(self):
        """
        Returns:
            int: how many railroads are owned by the owner of self.
        """
        with self._conn.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM `properties` AS p ',
                           'JOIN `property_values` AS pv ON ',
                           'p.`property_position`=',
                           'pv.`property_position` ',
                           'WHERE p.`game_id` = %s ',
                           'AND pv.`property_type` = `railroad` ',
                           'AND p.`player_id` = %s',
                           (self._gid, self._owner))
            result = cursor.fetchone()
            return result[result.keys()[0]]

    def utils_owned(self):
        """
        Returns:
            int: how many utilities are owned by the owner of self.
        """
        multiplier = 1
        with self._conn.cursor() as cursor:
            cursor.execute('SELECT COUNT(*) FROM `properties` ',
                           'WHERE `game_id` = %s ',
                           'AND `property_type` = `utility` ',
                           'AND `player_id` = %s',
                           (self._gid, self._owner))
            result = cursor.fetchone()
            if result[result.keys()[0]] == 2:
                multiplier = 2.5
            return multiplier


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
