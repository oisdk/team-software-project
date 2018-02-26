CREATE TABLE IF NOT EXISTS players (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    username varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    balance int NOT NULL DEFAULT 200,
    turn_position tinyint DEFAULT 0,
    board_position tinyint UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rolls (
    id int UNSIGNED NOT NULL,
    roll1 tinyint UNSIGNED NOT NULL,
    roll2 tinyint UNSIGNED NOT NULL,
    num int UNSIGNED NOT NULL,
    FOREIGN KEY (id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS games (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    state ENUM('waiting', 'playing') NOT NULL DEFAULT 'waiting',
    current_turn tinyint UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS playing_in (
    player_id int UNSIGNED NOT NULL,
    game_id int UNSIGNED NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Note that only 'tax' uses the value field in this table
CREATE TABLE IF NOT EXISTS miscellaneous (
    board_position tinyint UNSIGNED NOT NULL,
    type ENUM('tax', 'chance', 'community_chest', 'jail', 'parking', 'to_jail') NOT NULL,
    value smallint UNSIGNED,
    PRIMARY KEY (board_position)
);

CREATE TABLE IF NOT EXISTS properties (
    player_id int UNSIGNED NOT NULL DEFAULT '',
	game_id int UNSIGNED NOT NULL,
	state ENUM('unowned', 'owned') NOT NULL DEFAULT 'unowned',
	property_position tinyint UNSIGNED NOT NULL,
	house_count tinyint UNSIGNED DEFAULT 0,
	hotel_count tinyint UNSIGNED DEFAULT 0,
	FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
	FOREIGN KEY (property_position) REFERENCES property_values(property_position)
);

CREATE TABLE IF NOT EXISTS property_values (
    property_position tinyint UNSIGNED NOT NULL,
	purchase_price smallint UNSIGNED NOT NULL,
	state ENUM('property','railroad','utility') NOT NULL DEFAULT 'property',
	base_rent smallint UNSIGNED NOT NULL,
	house_price tinyint UNSIGNED NOT NULL DEFAULT 0,
	one_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	two_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	three_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	four_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	hotel_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (property_position)
);

CREATE TABLE IF NOT EXISTS properties (
    player_id int UNSIGNED NOT NULL,
	game_id int UNSIGNED NOT NULL,
	state ENUM('unowned', 'owned') NOT NULL DEFAULT 'unowned',
	property_position tinyint UNSIGNED NOT NULL,
	house_count tinyint UNSIGNED DEFAULT 0,
	hotel_count tinyint UNSIGNED DEFAULT 0,
	FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
	FOREIGN KEY (property_position) REFERENCES property_values(property_position)
);

INSERT INTO property_values
VALUES (1, 60, 'property', 2, 50, 10, 30, 90, 160, 250),
       (3, 60, 'property', 4, 50, 20, 60, 180, 320, 540),
	   (6, 100, 'property', 6, 50, 30, 90, 270, 400, 550),
	   (8, 100, 'property', 6, 50, 30, 90, 270, 400, 550),
	   (9, 120, 'property', 8, 50, 40, 100, 300, 450, 600),
	   (11, 140, 'property', 10, 100, 50, 150, 450, 625, 750),
	   (13, 140, 'property', 10, 100, 50, 150, 450, 625, 750),
	   (14, 160, 'property', 12, 100, 60, 180, 500, 700, 900),
	   (16, 180, 'property', 14, 100, 70, 200, 550, 750, 950),
	   (18, 180, 'property', 14, 100, 70, 200, 550, 750, 950),
	   (19, 200, 'property', 16, 100, 80, 220, 600, 800, 1000),
	   (21, 220, 'property', 18, 150, 90, 250, 700, 875, 1050),
	   (23, 220, 'property', 18, 150, 90, 250, 700, 875, 1050),
	   (24, 240, 'property', 20, 150, 100, 300, 750, 925, 1100),
	   (26, 260, 'property', 22, 150, 110, 330, 800, 975, 1150),
	   (27, 260, 'property', 22, 150, 110, 330, 800, 975, 1150),
	   (29, 280, 'property', 24, 150, 120, 360, 850, 1025, 1200),
	   (31, 300, 'property', 26, 200, 130, 390, 900, 1100, 1275),
	   (32, 300, 'property', 26, 200, 130, 390, 900, 1100, 1275),
	   (34, 320, 'property', 28, 200, 150, 450, 1000, 1200, 1400),
	   (37, 350, 'property', 35, 200, 175, 500, 1100, 1300, 1500),
	   (39, 400, 'property', 50, 200, 200, 600, 1400, 1700, 2000);

INSERT INTO miscellaneous (board_position, type)
VALUES (2, 'community_chest'),
       (7, 'chance'),
       (10, 'jail'),
       (17, 'community_chest'),
       (20, 'parking'),
       (22, 'chance'),
       (30, 'to_jail'),
       (33, 'community_chest'),
       (36, 'chance');

INSERT INTO miscellaneous
VALUES (4, 'tax', 200),
       (38, 'tax', 100);
