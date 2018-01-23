"""Module implementing storage for the app"""

import uuid


class Player:  # pylint: disable=too-few-public-methods
    """A class representing a player of
    monopoly.

    Initialisation of an instance of this class will store
    it in the database automatically. Similarly, any
    mutation of the public fields will result in mutation
    in the database.

    >>> print(Player("dave"))
    dave: []
    """
    def __init__(self, username):
        self.username = username
        self.rolls = []
        self._uuid = uuid.uuid1()

    @property
    def user_id(self):
        """A unique, read-only user id"""
        return self._uuid

    def __str__(self):
        return '%s: %s' % (self.username, self.rolls)

    def __eq__(self, other):
        return self.user_id == other.user_id


class DatabaseLookupError(LookupError):
    """Errors for when a key is not found in the database"""
    def __init__(self, key_desc, key_val):
        LookupError.__init__(self)
        self.key_desc = key_desc
        self.key_val = key_val

    def __str__(self):
        return 'Could not find entry for %s key %s' % (self.key_desc,
                                                       self.key_val)


def retrieve_player(user_id):
    """Retieves a player from the database.
    Raises a DatabaseLookupError if not found.

    >>> retrieve_player(123)
    Traceback (most recent call last):
        ...
    backend.storage.DatabaseLookupError: \
Could not find entry for user_id key 123
    """
    raise DatabaseLookupError("user_id", user_id)
