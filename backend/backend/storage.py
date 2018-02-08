"""Module implementing storage for the app"""

import pymysql.cursors

def make_connection():
    return pymysql.connect(host='localhost',
                           user='root',
                           password='',
                           db='db',
                           charset='utf8imb4',
                           cursorclass=pymysql.cursors.DictCursor)
