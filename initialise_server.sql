CREATE TABLE IF NOT EXISTS players (
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    username varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    balance int NOT NULL DEFAULT 1500,
    turn_position tinyint DEFAULT 0,
    board_position tinyint NOT NULL DEFAULT 0,
    jail_state ENUM('not_in_jail', 'in_jail') NOT NULL DEFAULT 'not_in_jail',
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

CREATE TABLE IF NOT EXISTS property_values (
    property_position tinyint UNSIGNED NOT NULL,
    name varchar(30) NOT NULL,
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
    player_id int UNSIGNED NOT NULL DEFAULT 0,
    game_id int UNSIGNED NOT NULL,
    state ENUM('unowned', 'owned') NOT NULL DEFAULT 'unowned',
    mortgaged ENUM('unmortgaged', 'mortgaged') NOT NULL DEFAULT 'unmortgaged',
    property_position tinyint UNSIGNED NOT NULL,
    house_count tinyint UNSIGNED DEFAULT 0,
    hotel_count tinyint UNSIGNED DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (property_position) REFERENCES property_values(property_position)
);

CREATE TABLE IF NOT EXISTS cards (
    unique_id tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
    card_type ENUM('chance','chest') NOT NULL,
    description VARCHAR(255) NOT NULL,
    operation ENUM('move_specific', 'get_money', 'pay_bank', 'pay_opponents', 'collect_from_opponents', 'pay_per_house') NOT NULL,
    -- operation_value will mean different things (e.g. money, position) depending on the "operation"
    operation_value smallint,
    PRIMARY KEY (unique_id)
);

INSERT INTO cards (card_type, description, operation, operation_value)
VALUES ('chest', "Advance to Go", "move_specific", 0),
       ('chest', "Bank error in your favour – Collect 200", "get_money", 200),
       ('chest', "Doctor's fees – Pay 50", "pay_bank", 50),
       ('chest', "Go to Jail", "move_specific", 30),
       ('chest', "Income tax refund – Collect 20", 'get_money', 20),
       ('chest', "From Sale of Stock you get 50", 'get_money', 50),
       ('chest', "It is Your Birthday Collect 10 from each Player", 'collect_from_opponents', 10),
       ('chest', "Annuity Matures Collect 100", 'get_money', 100),
       ('chest', "Pay your Insurance Premium - Pay 50", 'pay_bank', 50),
       ('chest', "Pay a 10 Fine", 'pay_bank', 10),
       ('chest', "Go Back to Old Kent Road", 'move_specific', 1),
       ('chest', "Receive Interest on 7% Preference Shares 25", 'get_money', 25),
       ('chest', "Pay hospital 100", 'pay_bank', 100),
       ('chest', "You have won second prize in a beauty contest – Collect 10", 'get_money', 10),
       ('chest', "You inherit 100", 'get_money', 100),

       ('chance', "Advance to Mayfair", 'move_specific', 39),
       ('chance', "You are Assessed for Street Repairs 40 per House", 'pay_per_house', 40),
       ('chance', "Go to Jail", 'move_specific', 30),
       ('chance', "Bank pays you Dividend of 50", 'get_money', 50),
       ('chance', "Go back 3 Spaces", 'move_specific', -3),
       ('chance', "Pay School Fees of 150", 'pay_bank', 150),
       ('chance', "Make General Repairs on all of Your Houses - For each House pay 25", 'pay_per_house', 25),
       ('chance', "Speeding Fine 15", 'pay_bank', 15),
       ('chance', "You have won a Crossword Competition Collect 100", 'get_money', 100),
       ('chance', "Your Building and Loan Matures Collect 150", 'get_money', 150),
       ('chance', "Advance to Trafalgar Square", 'move_specific', 24),
       ('chance', "Take a Trip to Marylebone Station", 'move_specific', 15),
       ('chance', "Adbance to Pall Mall", 'move_specific', 11),
       ('chance', "Drunk in Charge", 'pay_bank', 20),
       ('chance', "Advance to Go", "move_specific", 0);

INSERT INTO property_values
VALUES (1, 'Old Kent Road', 60, 'property', 2, 50, 10, 30, 90, 160, 250),
       (3, 'Whitechapel Road', 60, 'property', 4, 50, 20, 60, 180, 320, 540),
       (6, 'The Angel, Islington', 100, 'property', 6, 50, 30, 90, 270, 400, 550),
       (8, 'Euston Road', 100, 'property', 6, 50, 30, 90, 270, 400, 550),
       (9, 'Pentonville Road', 120, 'property', 8, 50, 40, 100, 300, 450, 600),
       (11, 'Pall Mall', 140, 'property', 10, 100, 50, 150, 450, 625, 750),
       (13, 'Whitehall', 140, 'property', 10, 100, 50, 150, 450, 625, 750),
       (14, 'Northumberland Road', 160, 'property', 12, 100, 60, 180, 500, 700, 900),
       (16, 'Bow Street', 180, 'property', 14, 100, 70, 200, 550, 750, 950),
       (18, 'Marlborough Street', 180, 'property', 14, 100, 70, 200, 550, 750, 950),
       (19, 'Vine Street', 200, 'property', 16, 100, 80, 220, 600, 800, 1000),
       (21, 'Strand', 220, 'property', 18, 150, 90, 250, 700, 875, 1050),
       (23, 'Fleet Street', 220, 'property', 18, 150, 90, 250, 700, 875, 1050),
       (24, 'Trafalgar Square', 240, 'property', 20, 150, 100, 300, 750, 925, 1100),
       (26, 'Leicester Square', 260, 'property', 22, 150, 110, 330, 800, 975, 1150),
       (27, 'Coventry Street', 260, 'property', 22, 150, 110, 330, 800, 975, 1150),
       (29, 'Piccadilly', 280, 'property', 24, 150, 120, 360, 850, 1025, 1200),
       (31, 'Regent Street', 300, 'property', 26, 200, 130, 390, 900, 1100, 1275),
       (32, 'Oxford Street', 300, 'property', 26, 200, 130, 390, 900, 1100, 1275),
       (34, 'Bond Street', 320, 'property', 28, 200, 150, 450, 1000, 1200, 1400),
       (37, 'Park Lane', 350, 'property', 35, 200, 175, 500, 1100, 1300, 1500),
       (39, 'Mayfair', 400, 'property', 50, 200, 200, 600, 1400, 1700, 2000),
       (5, 'Kings Cross Station', 200, 'railroad', 25, 0, 0 , 0, 0, 0, 0),
       (15, 'Marylebone Station', 200, 'railroad', 25, 0, 0 , 0, 0, 0, 0),
       (25, 'Fenchurch Street Station', 200, 'railroad', 25, 0, 0 , 0, 0, 0, 0),
       (35, 'Liverpool Street Station', 200, 'railroad', 25, 0, 0 , 0, 0, 0, 0),
       (12, 'Electric Company', 150, 'utility', 4, 0, 0 , 0, 0, 0, 0),
       (28, 'Water Works', 150, 'utility', 4, 0, 0 , 0, 0, 0, 0);

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
