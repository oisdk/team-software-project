/* Set the player_id for all the statements */

UPDATE properties,
SET player_id = ..., mortgaged = 'mortgaged',
WHERE property_position = 8;

UPDATE properties,
SET player_id = ..., mortgaged = 'unmortgaged',
WHERE property_position = 6;

UPDATE properties,
SET player_id = ..., mortgaged = 'unmortgaged',
WHERE property_position = 21;
