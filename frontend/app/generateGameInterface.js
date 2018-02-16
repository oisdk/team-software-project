// Imports
import * as sendJSON from './sendJSON';
import * as getCookie from './checkUserIDCookie';
import {initialiseEventSource} from './sse';

const details = getCookie.checkUserDetails();
const id = details.user_id;


/**
 * Function to disable game interface.
 */
export function disableGameInterface() {
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('end-turn').disabled = true;
}

/**
 * Function to enable game interface.
 */
export function enableGameInterface() {
    document.getElementById('roll-dice').disabled = false;
    document.getElementById('end-turn').disabled = true;
}

/**
 * Function to enable end-turn functionality.
 */
export function enableEndTurn() {
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('end-turn').disabled = false;
}


/**
 * Callback to check user rolls and enable end turn.
 *
 * @param {XMLHttpRequest} req1 response.
 */
export function successCallback(req1) {
    console.log(req1);
    const response = JSON.parse(req1.responseText);
    if (response.your_rolls[0] !== response.your_rolls[1]) {
        enableEndTurn();
    }
}

/**
 * Function to call the roll_dice on the server side.
 * @param {Function} JSONSend - JSON function makes testing easier.
 */
export function rollDice(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/roll_dice.py',
        jsonObject: {user_id: id},
        successCallback,
    });
}

/**
 * Function to end a players turn.
 * @param {Function} JSONSend - JSON function makes testing easier.
 */
export function endTurn(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/increment_turn.py',
        jsonObject: {player_id: id},
    });
    disableGameInterface();
}


/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateGamePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-right').innerHTML = fileReader.responseText;
        const rollDiceButton = document.getElementById('roll-dice');
        rollDiceButton.onclick = () => { rollDice(sendJSON.sendJSON); };
        const endTurnButton = document.getElementById('end-turn');
        endTurnButton.onclick = () => { endTurn(sendJSON.sendJSON); };
    }
}

/**
 * Function to generate game interface. Makes a request to local
 * filesystem for a HTML file to display.
 */
export function generateGameInterface() {
    //console.log("GameId:");
    //console.log(gameID);
    console.log("PlayerId:");
    console.log(id);
    console.log(`playerTurn${id}`);
    //SSE Events
    const sseEventSource = initialiseEventSource(1);
    sseEventSource.addEventListener(`playerTurn${id}`, (turnEvent) => {
        const turn = JSON.parse(turnEvent.data);
        console.log("Turn:");
        console.log(turn);
    });
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'game-interface.html', true);
    fileReader.onreadystatechange = () => updateGamePage(fileReader);
    fileReader.send();
}

