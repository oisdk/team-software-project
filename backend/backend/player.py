"""This module implements the Player class, used to represent individual
players of Monopoly"""

import backend.storage

# uid
# list of rolls

# List of players
# Current turn
# Game state: WAITING|PLAYING


class Player:
    def __init__(self, uid):
        self._uid = uid
        self._in_context = False

    def __enter__(self):
        self._in_context = True
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
        self._in_context = False

    @property
    def uid(self):
        return self._uid

    @property
    def username(self):
        if self._in_context:
            return self._username
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`username`) FROM `players` '
                                   'WHERE `id` = %s;',
                                   (self.uid,))
                    return cursor.fetchone()['username']
            finally:
                conn.close()

    @property
    def balance(self):
        if self._in_context:
            return self._balance
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`balance`) FROM `players` '
                                   'WHERE `id` = %s;',
                                   (self.uid,))
                    return cursor.fetchone()['balance']
            finally:
                conn.close()

    @property
    def turn_position(self):
        if self._in_context:
            return self._turn_position
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`turn_position`) FROM `players` '
                                   'WHERE `id` = %s;',
                                   (self.uid,))
                    return cursor.fetchone()['turn_position']
            finally:
                conn.close()

    @property
    def board_position(self):
        if self._in_context:
            return self._board_position
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`board_position`) FROM `players` '
                                   'WHERE `id` = %s;',
                                   (self.uid,))
                    return cursor.fetchone()['board_position']
            finally:
                conn.close()

    @property
    def rolls(self):
        if self._in_context:
            return self._rolls
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                cursor.execute('SELECT (`roll1`, `roll2`) FROM `rolls`'
                               'WHERE `id` = %s ORDER BY `number`;',
                               (self.uid,))
                return [(result['roll1'], result['roll2'])
                        for result in cursor.fetchall()]
            finally:
                conn.close()


