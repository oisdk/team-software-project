import backend.storage


class Player:
    def __init__(self, username=None, uid=None):
        if username is None and uid is None:
            raise TypeError("Player() expects one argument of either username or uid, none given")
        elif username is not None and uid is not None:
            raise TypeError("Player() expects one argument of either username or uid, two given")
        elif username is not None:
            self.username = username
            self._new = True
        else:
            self._uid = uid
            self._new = False

    def __enter__(self):
        self._conn = storage.make_connection()
        self._conn.begin()
        if self._new:
            with self._conn.cursor() as cursor:
                cursor.execute('INSERT INTO `players` (`username`) (%s); SELECT LAST_INSERT_ID();',
                               (self.username,))
                self._uid = cursor.fetchone()
            self.rolls = []
        else:
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT (`username`) FROM `players` WHERE `id` = %s;', (self.uid,))
                self.username = cursor.fetchone()['username']
            with self._conn.cursor() as cursor:
                cursor.execute('SELECT (`roll1`, `roll2`) FROM  `rolls` WHERE `id` = %s ORDER BY `number`;', (self.id,))
                self.rolls = [(result['roll1'], result['roll2']) for result in cursor.fetchall()]

    def __exit__(self):
        with self._conn.cursor() as cursor:
            cursor.execute('UPDATE `players` SET `username` = %s WHERE `id` = %s', (self.username, self.uid))
            cursor.execute('REPLACE INTO `rolls` VALUES (%s, %s, %s, %s)',
                           ((self.uid, roll1, roll2, i) for i, (roll1, roll2) in enumerate(self.rolls)))
        self._conn.commit()
        self._conn.close()

    @property
    def uid(self):
        return self._uid
