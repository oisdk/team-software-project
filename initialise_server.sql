CREATE TABLE IF NOT EXISTS `players` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` varchar(255) CHARACTER SET utf8mb4 NOT NULL, 
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `rolls` (
    `id` int UNSIGNED NOT NULL,
    `roll1` tinyint UNSIGNED NOT NULL,
    `roll2` tinyint UNSIGNED NOT NULL,
    `number` int UNSIGNED NOT NULL,
    FOREIGN KEY (`id`) REFERENCES `players`(`id`)
);

CREATE TABLE IF NOT EXISTS `games` (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `playing_in` (
    `player_id` int UNSIGNED NOT NULL,
    `game_id` int UNSIGNED NOT NULL,
    `number` int UNSIGNED NOT NULL,
    FOREIGN KEY (`player_id`) REFERENCES `players`(`id`),
    FOREIGN KEY (`game_id`) REFERENCES `games`(`id`)
);
