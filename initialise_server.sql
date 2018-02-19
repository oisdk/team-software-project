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

CREATE TABLE IF NOT EXISTS properties (
    player_id int UNSIGNED NOT NULL,
	game_id int UNSIGNED NOT NULL,
	state ENUM('unowned', 'owned') NOT NULL DEFAULT 'unowned',
	property_position tinyint UNSIGNED NOT NULL,
	house_count tinyint UNSIGNED DEFAULT 0,
	hotel_count tinyint UNSIGNED DEFAULT 0,
	FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS property_values (
    property_position tinyint UNSIGNED NOT NULL,
	purchase_price smallint UNSIGNED NOT NULL,
	state ENUM('property','railroad','utility') NOT NULL DEFAULT 'property',
	base_rent smallint UNSIGNED NOT NULL,
	monopoly_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	house_price tinyint UNSIGNED NOT NULL DEFAULT 0,
	one_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	two_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	three_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	four_rent smallint UNSIGNED NOT NULL DEFAULT 0,
	hotel_rent smallint UNSIGNED NOT NULL DEFAULT 0,
);
