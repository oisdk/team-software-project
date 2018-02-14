// Import sendJSON functionality
import * as sendJSON from './sendJSON';
import * as getCookie from './checkUserIDCookie';

const details = getCookie.checkUserDetails();
const id = details.user_id;
let rollDiceButton = "";
let endTurnButton = "";

/**
 * Callback for when game_id successfully received.
 *
 * @param {XMLHttpRequest} req1 response.
 */
export function successCallback(req1) {
    const response = JSON.parse(req1.responseText);
    console.log(response);
}

/**
 * Function to call the roll_dice on the server side.
 */
export function rollDice(JSONSend = sendJSON.sendJSON) {
    JSONSend({
        serverAddress: 'cgi-bin/roll_dice.py',
        jsonObject: {user_id: id},
        successCallback,
    });
    rollDiceButton.disabled = true;
    endTurnButton.disabled = false;
}

/**
 * Function to call to end a players turn.
 */
export function endTurn(JSONSend = sendJSON.sendJSON) {
    JSONSend({
        serverAddress: 'cgi-bin/increment_turn.py',
        jsonObject: {player_id: id},
        successCallback,
    });
}


/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateGamePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-right').innerHTML = fileReader.responseText;
        rollDiceButton = document.getElementById('roll-dice');
        rollDiceButton.addEventListener('click', rollDice, false);
        endTurnButton = document.getElementById('end-turn');
        endTurnButton.addEventListener('click', endTurn, false);
        endTurnButton.disabled = true;
    }
}

/**
 * Function to generate game interface. Makes a request to local
 * filesystem for a HTML file to display.
 */
export function generateGameInterface() {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'game-interface.html', true);
    fileReader.onreadystatechange = () => updateGamePage(fileReader);
    fileReader.send();
}

