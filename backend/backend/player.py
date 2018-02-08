"""This module implements the Player class, used to represent individual
players of Monopoly"""

import backend.storage

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
        with self._conn.cursor() as cursor:
            cursor.execute('SELECT * FROM `players` WHERE `id` = %s;',
                           (self.uid,))
            result = cursor.fetchone()
            self._username = result['username']
            self._balance = result['balance']
            self._turn_position = result['turn_position']
            self._board_position = result['board_position']
            cursor.execute('SELECT (`roll1`, `roll2`) FROM `rolls` '
                           'WHERE `id` = %s ORDER BY `number`;',
                           (self.uid,))
            self._rolls = [(result['roll1'], result['roll2'])
                          for result in cursor.fetchall()]
        return self

    def __exit__(self, a, b, c):
        with self._conn.cursor() as cursor:
            cursor.execute('UPDATE `players` '
                           'SET `username` = %s, '
                           '`balance` = %s, '
                           '`turn_position` = %s, '
                           '`board_position` = %s, '
                           'WHERE `id` = %s;',
                           (self.username, self.balance,
                            self.turn_position, self.board_position,
                            self.uid))
            cursor.execute('REPLACE INTO `rolls` VALUES (%s, %s, %s, %s);',
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
                cursor.execute('SELECT (`roll1`, `roll2`) FROM `rolls` '
                               'WHERE `id` = %s ORDER BY `number`;',
                               (self.uid,))
                return [(result['roll1'], result['roll2'])
                        for result in cursor.fetchall()]
            finally:
                conn.close()

    @username.setter
    def username(self, username):
        if self._in_context:
            self._username = username
        else:
            raise TypeError('Must be within with statement to mutate the '
                            'Player class')


    @balance.setter
    def balance(self, balance):
        if self._in_context:
            self._balance = balance
        else:
            raise TypeError('Must be within with statement to mutate the '
                            'Player class')

    @turn_position.setter
    def turn_position(self, trun_position):
        if self._in_context:
            self._turn_position = turn_position
        else:
            raise TypeError('Must be within with statement to mutate the '
                            'Player class')

    @board_position.setter
    def board_position(self, board_position):
        if self._in_context:
            self._board_position = board_position
        else:
            raise TypeError('Must be within with statement to mutate the '
                            'Player class')
    @rolls.setter
    def rolls(self, rolls):
        if self._in_context:
            self._rolls = rolls
        else:
            raise TypeError('Must be within with statement to mutate the '
                            'Player class')
