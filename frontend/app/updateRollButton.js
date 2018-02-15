// Import sendJSON functionality
import * as sendJSON from './sendJSON';
// Import getCookie functionality
import * as getCookie from './checkUserIDCookie';

// Enables the roll button for the player if the previous
// roll values are equal
export function checkRollValuesEqual(req) {
    const state = JSON.parse(req.responseText);
    const rollDie = document.querySelector('#roll');
    rollDie.disabled = !state;
}

// Adds event listener to the roll button for the player to
// enable/disable the button
export function requestCompareRolls(JSONSend = sendJSON.sendJSON) {
    const details = getCookie.checkUserDetails();
    const id = details.user_id;
    JSONSend({
        serverAddress: 'cgi-bin/compare_dice_rolls.py',
        jsonObject: {player_id: id},
        checkRollValuesEqual,
    });
}
