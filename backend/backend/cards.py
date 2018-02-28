""" Module to provide accessors for the "cards" database table. """

import backend.storage


def get_card_details(unique_id):
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * '
                           'FROM cards '
                           'WHERE unique_id = %s;', (unique_id))
            result = cursor.fetchone()
        return result

    finally:
        conn.close()
