"""This module provides the Game class"""

from operator import itemgetter
from itertools import groupby

import backend.storage


class Game(object):  # pylint: disable=too-many-instance-attributes
    """A single game of monopoly. Refer to the Player class for how to
    access and mutate members."""
    def __init__(self, uid):
        self._uid = uid
        self._in_context = False
        self._players = None
        self._current_turn = None
        self._state = None
        self._conn = None

    def __enter__(self):
        self._in_context = True
        self._conn = backend.storage.make_connection()
        self._conn.begin()
        with self._conn.cursor() as cursor:
            cursor.execute('SELECT * FROM `games` WHERE `id` = %s;',
                           (self.uid,))
            result = cursor.fetchone()
            self._current_turn = result['current_turn']
            self._state = result['state']
            del result
            cursor.execute('SELECT `player_id` FROM `playing_in` '
                           'WHERE `game_id` = %s;',
                           (self.uid,))
            self._players = [result['player_id']
                             for result in cursor.fetchall()]
        return self

    def __exit__(self, *exc):
        try:
            with self._conn.cursor() as cursor:
                cursor.execute('UPDATE `games` '
                               'SET `current_turn` = %s, '
                               '`state` = %s '
                               'WHERE `id` = %s;',
                               (self.current_turn, self.state,
                                self.uid))
                cursor.execute('DELETE FROM `playing_in` '
                               'WHERE `game_id` = %s;',
                               (self.uid))

                cursor.executemany('INSERT INTO `playing_in` VALUES (%s, %s);',
                                   ((pid, self.uid) for pid in self.players))
            self._conn.commit()
        finally:
            self._in_context = False
            self._conn.close()

    @property
    def uid(self):
        """
        Returns:
            int: the (immutable) unique id of this game.
        """
        return self._uid

    @property
    def current_turn(self):
        """
        Returns:
            int: the current position in the playing queue.

        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return backend.storage.request_property(self, self._in_context,
                                                'games', 'current_turn')

    @property
    def state(self):
        """
        Returns:
            str: the state of the game.

        Raises:
            TypeError: if mutated outside of a with statement.
        """
        return backend.storage.request_property(self, self._in_context,
                                                'games', 'state')

    @property
    def players(self):
        """
        Returns:
            [int]: a list of the ids of the players in this game.

        Raises:
            TypeError: if mutated outside of a with statement.
        """
        if self._in_context:
            return self._players
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`player_id`) FROM `playing_in` '
                                   'WHERE `game_id` = %s;',
                                   (self.uid,))
                    return [result['player_id']
                            for result in cursor.fetchall()]
            finally:
                conn.close()

    def _set_property(self, name, new_value):
        if self._in_context:
            setattr(self, '_' + name, new_value)
        else:
            raise TypeError('Must be within "with" statement to mutate the '
                            'Game class')

    @current_turn.setter
    def current_turn(self, current_turn):
        self._set_property('current_turn', current_turn)

    @state.setter
    def state(self, state):
        self._set_property('state', state)

    @players.setter
    def players(self, players):
        self._set_property('players', players)


def create_game(host):
    """Create a new game on the server

    Args:
        host(id): the id of the player who clicked "create game".

    Returns:
        int: the game's unique id.
    """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO `games` () VALUES ();', ())
            cursor.execute('SELECT LAST_INSERT_ID();')
            result = cursor.fetchone()['LAST_INSERT_ID()']
            cursor.execute('INSERT INTO `playing_in` VALUES (%s, %s)',
                           (host, result))
        conn.commit()
        return result
    finally:
        conn.close()


def get_games(with_game_status=None):
    """Returns a dictionary where the keys are the game ids, in the waiting
    room and the values is a list of participating players."""
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            result = None
            if not with_game_status:
                cursor.execute('SELECT playing_in.game_id, players.username '
                               'FROM playing_in '
                               'INNER JOIN players ON '
                               'playing_in.player_id = players.id '
                               'ORDER BY playing_in.game_id;')
                result = {game_id: [user['username'] for user in row]
                          for game_id, row
                          in groupby(cursor.fetchall(), itemgetter('game_id'))}
            else:
                cursor.execute('SELECT playing_in.game_id, players.username '
                               'FROM playing_in '
                               'INNER JOIN players '
                               'INNER JOIN games ON '
                               'playing_in.player_id = players.id AND '
                               'playing_in.game_id = games.id '
                               'WHERE games.state = %s '
                               'ORDER BY playing_in.game_id;',
                               (with_game_status,))
                result = {game_id: [user['username'] for user in row]
                          for game_id, row
                          in groupby(cursor.fetchall(), itemgetter('game_id'))}
        conn.commit()
        return result
    finally:
        conn.close()
