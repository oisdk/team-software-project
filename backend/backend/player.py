"""This module implements the Player class, used to represent individual
players of Monopoly"""

import backend.storage

# uid
# username
# balance
# position (single int)
# list of rolls
# turn position

# List of players
# Current turn
# Game state: WAITING|PLAYING


class Player:
    """A player of the monopoly game.

    To create an instance of this class, initialise it with either a username or
    a unique id (but not both). Any manipulation or *use* of the instance, however,
    should be done within a with statement. For instance, to change a player's
    username, do the following::

        with Player(uid=123) as player:
            player.username = "dave"

    That will properly hande transactions etc.

    Args:
        username (str): If initialised with a username, a new player will be
            created in persistent storage. If a username is provided, a
            unique id must not be provided.
        uid (int): If initialised with a unique id (uid), the existing
            player will be retrieved from storage. If a unique id is
            provided, a username must not be provided.

    Attributes:
        rolls ([(int,int)]): A list of the rolls the player has received, in 
            order.
        username (str): The players (possible non-unique) username.
    """
    def __init__(self, username=None, uid=None):
        if username is None and uid is None:
            raise TypeError('Player() expects one argument of either username'
                            'or uid, none given')
        elif username is not None and uid is not None:
            raise TypeError('Player() expects one argument of either username'
                            'or uid, two given')
        elif username is not None:
            self.username = username
            self._new = True
        else:
            self._uid = uid
            self._new = False

    def __enter__(self):
        self._conn = backend.storage.make_connection()
        self._conn.begin()
        if self._new:
            with self._conn.cursor() as cursor:
                cursor.execute('INSERT INTO `players` (`username`) VALUES (%s);',
                               (self.username,))
                cursor.execute('SELECT LAST_INSERT_ID();')
                self._uid = cursor.fetchone()
            self.rolls = []
        else:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT (`username`) FROM `players`'
                               'WHERE `id` = %s;',
                               (self.uid,))
                self.username = cursor.fetchone()['username']
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT (`roll1`, `roll2`) FROM `rolls`'
                               'WHERE `id` = %s ORDER BY `number`;',
                               (self.id,))
                self.rolls = [(result['roll1'], result['roll2'])
                              for result in cursor.fetchall()]
        return self

    def __exit__(self, a, b, c):
        with self._conn.cursor() as cursor:
            cursor.execute('UPDATE `players` SET `username` = %s '
                           'WHERE `id` = %s',
                           (self.username, self.uid))
            cursor.execute('REPLACE INTO `rolls` VALUES (%s, %s, %s, %s)',
                           ((self.uid, roll1, roll2, i)
                            for i, (roll1, roll2) in enumerate(self.rolls)))
        self._conn.commit()
        self._conn.close()

    @property
    def uid(self):
        return self._uid
