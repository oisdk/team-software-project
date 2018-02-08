import backend.storage


class Game(object):
    def __init__(self, uid):
        self._uid = uid
        self._in_context = False
        self._players = None
        self._current_turn = None
        self._state =  None

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
                               '`state` = %s, '
                               'WHERE `id` = %s;',
                               (self.current_turn, self.state,
                                self.uid))
                cursor.execute('DELETE FROM `playing_in` WHERE `id = %s;',
                               (self.uid,))
                cursor.executemany('INSERT INTO `playing_in` VALUES (%s, %s);',
                                   ((pid, self.uid) for pid in self.players))
            self._conn.commit()
        finally:
            self._in_context = False
            self._conn.close()

    def _get_property(self, name):
        if self._in_context:
            return getattr(self, '_' + name)
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (%s) FROM `games` '
                                   'WHERE `id` = %s;',
                                   (name, self.uid))
                    return cursor.fetchone()[name]
            finally:
                conn.close()

    @property
    def uid(self):
        return self._uid

    @property
    def current_turn(self):
        return self._get_property('current_turn')

    @property
    def state(self):
        return self._get_property('state')

    @property
    def players(self):
        if self._in_context:
            return self._players
        else:
            conn = backend.storage.make_connection()
            try:
                with conn.cursor() as cursor:
                    cursor.execute('SELECT (`player_id`) FROM `playing_in` '
                                   'WHERE `game_id` = %s;',
                                   (self,uid,))
                    return [result['player_id']
                            for result in cursor.fetchall()]
            finally:
                conn.close()

    def _set_property(sefl, name, new_value):
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
