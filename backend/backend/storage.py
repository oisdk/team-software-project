"""Module implementing storage for the app"""

import pymysql.cursors

def make_connection():
    return pymysql.connect(host='localhost',
                           user='root',
                           password='',
                           db='db',
                           charset='utf8imb4',
                           cursorclass=pymysql.cursors.DictCursor)

################################################################################
# Table Structures
################################################################################

# Players
def player_table_creation_statement():
    return """
CREATE TABLE IF NOT EXISTS `players` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` varchar(255) CHARACTER SET utf8mb4 NOT NULL, 
    PRIMARY KEY (`id`)
);
"""

# Rolls
def rolls_table_creation_statement():
    return """
CREATE TABLE IF NOT EXISTS `rolls` (
    `id` int UNSIGNED NOT NULL,
    `roll1` tinyint UNSIGNED NOT NULL,
    `roll2` tinyint UNSIGNED NOT NULL,
    `number` int UNSIGNED NOT NULL,
    FOREIGN KEY (`id`) REFERENCES `players`(`id`)
);
"""

# Games
def games_table_creation_statement():
    return """
CREATE TABLE IF NOT EXISTS `games` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
);
"""

# playing_in
def playing_in_table_creation_statement():
    return """
CREATE TABLE IF NOT EXISTS `playing_in` (
    `player_id` int UNSIGNED NOT NULL,
    `game_id` int UNSIGNED NOT NULL,
    `number` int UNSIGNED NOT NULL,
    FOREIGN KEY (`player_id`) REFERENCES `players`(`id`),
    FOREIGN KEY (`game_id`) REFERENCES `games`(`id`)
);
"""
