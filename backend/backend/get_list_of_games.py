import pymysql as db

def get_list_of_games():
    """Function that returns a list of the games available

       for client to join

    """
    
    listOfGames=[]

    try:
        connection = db.connect('cs1dev.ucc.ie', 'gss1', 'voqueixe', '2019_gss1')
        cursor = connection.cursor(db.cursors.DictCursor)
        cursor.execute("""SELECT name
                          FROM games
                          ORDER BY name DESC""")
        
        for row in cursor.fetchall():
            listOfGames += [row['name']]

        cursor.close()
        connection.close()
        return listOfGames

    except db.Error:
        return('Unable to connect to the database.')

