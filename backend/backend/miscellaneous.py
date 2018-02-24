""" Provide functionality to retrieve values from "miscellaneous" table. """

import backend.storage


def get_misc_positions():
    """ Get a list of miscellaneous board positions.

    Returns:
        A list of miscellaneous positions on the board.

    """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT board_position '
                           'FROM miscellaneous;')
            result = [row["board_position"] for row in cursor.fetchall()]
        return result

    finally:
        conn.close()


def get_space_details(board_position):
    """ Get the details for a specific miscellaneous space on the board.

    Arguments:
        board_position: An int representing a position on the game board.

    Returns:
        A dictionary with column names as key and row as value.

    """
    conn = backend.storage.make_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            cursor.execute('SELECT * '
                           'FROM miscellaneous '
                           'WHERE board_position = %s;', (board_position))
            row = cursor.fetchone()
            result = {"type": row["type"], "value": row["value"]}
        return result

    finally:
        conn.close()
