import * as sendJSON from './sendJSON';
import * as getCookie from './checkUserIDCookie';

/**
 * Callback for when player's roll dice values successfully received.
 *
 * @param {XMLHttpRequest} req Contains the response with the roll dice values.
 */

export function checkRollValuesEqual(req) {
    const response = JSON.parse(req.responseText);
    const roll = response.player_id;
    // Enables the roll button for the player if the
    // roll values are equal otherwise disables button
    const rollDie = document.querySelector('#roll');
    if (roll[0] === roll[1]) {
        rollDie.disabled = false;
    } else {
        rollDie.disabled = true;
    }
}

/**
 * Make a request for roll dice.
 *
 * @param {Function} JSONSend The function to make the request to the server.
 */
export function processRollButton(JSONSend = sendJSON.sendJSON) {
    // This function adds event listener to the roll button for the
    // player to enable/disable the button
    const details = getCookie.checkUserDetails();
    const id = details.user_id;
    JSONSend({
        serverAddress: 'cgi-bin/request_dice_roll.py',
        jsonObject: {player_id: id},
        checkRollValuesEqual,
    });
}
