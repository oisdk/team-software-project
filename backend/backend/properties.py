"""This module provides the Property class"""

import backend.storage


class Property(object):  # pylint: disable=too-many-instance-attributes
    """A single property in a game of monopoly. Refer to the Player class for how to
    access and mutate members."""
    def __init__(self, position, gid):
        self._gid = gid
		self._positon = position
        self._in_context = False
		self._property_state = None
		self._houses = 0
		self._hotels = 0
		self._owner = None
		self._price = 0
		self._property_type = None
		self._base = 0
		self._monopoly = 0
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
                           (self._gid,self._position))
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
			self._property_type = result['purchase_price']
			self._base = result['purchase_price']
			self._monopoly = result['purchase_price']
			self._house_price = result['purchase_price']
			self._one = result['purchase_price']
			self._two = result['purchase_price']
			self._three = result['purchase_price']
			self._four = result['purchase_price']
			self._hotel = result['purchase_price']
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
                               (self._owner, self._property_state, self._houses, 
							    self._hotels, self._gid, self._position))
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
		if houses == 0 && hotels == 0:
			#if there is a monopoly
			#    return self._monopoly
			#else:
			return self._base
		elif houses == 1:
		    return self._one
		elif houses == 2:
		    return self._two
		elif houses == 3:
		    return self._three
		elif houses == 4:
		    return self._four
		else:
		    return self._hotel
		
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

