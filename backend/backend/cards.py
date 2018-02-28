""" Module to provide accessors for the "cards" database table. """

import backend.storage


def get_card_details(unique_id):
    """Convenience function to get card details from the "cards" table.

    Arguments:
        unique_id: An int representing the primary key column in the "cards"
            table.

    Returns:
        A dictionary mapping all columns names in the "cards" table to column
        values for the specified card.

    """
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
