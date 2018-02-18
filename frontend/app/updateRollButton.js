// Import sendJSON functionality
import * as sendJSON from './sendJSON';
// Import getCookie functionality
import * as getCookie from './checkUserIDCookie';

/**
 * Callback for when player's roll dice values successfully received.
 *
 * @param {XMLHttpRequest} req Contains the response with the roll dice values.
 */
export function checkRollValuesEqual(req) {
    // Enables the roll button for the player if the previous
    // roll values are equal
    const state = JSON.parse(req.responseText);
    const rollDie = document.querySelector('#roll');
    rollDie.disabled = !state;
}

/**
 * Make a request for roll dice.
 *
 * @param {Function} JSONSend The function to make the request to the server.
 */
export function requestCompareRolls(JSONSend = sendJSON.sendJSON) {
    // Adds 'event listener' to the roll button for the player to
    // enable/disable the button
    const details = getCookie.checkUserDetails();
    const id = details.user_id;
    JSONSend({
        serverAddress: 'cgi-bin/compare_dice_rolls.py',
        jsonObject: {player_id: id},
        checkRollValuesEqual,
    });
}
