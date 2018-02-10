"""Module implementing storage for the app"""

import pymysql.cursors


def make_connection():
    """Create a connection object to the monopoly database."""
    return pymysql.connect(host='localhost',
                           user='root',
                           password='',
                           db='db',
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)


def request_property(cls, in_context, table, name):
    """Helper function to implement requesting a property from
    the database."""
    if in_context:
        return getattr(cls, '_' + name)
    else:
        conn = make_connection()
        try:
            with conn.cursor() as cursor:
                query = 'SELECT ({}) FROM {} '.format(name, table)
                cursor.execute(query + 'WHERE `id` = %s;', (cls.uid))
                return cursor.fetchone()[name]
        finally:
            conn.close()
