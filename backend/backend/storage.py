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
