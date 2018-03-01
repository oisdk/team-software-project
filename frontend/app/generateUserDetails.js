// Imports
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';

let details = getCookie.checkUserDetails();
let id = details.user_id;
let userName = details.user_name;

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
    enableEndTurn();
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
 * @param {HTMLElement} rootElement The element to attach the user details to.
 */
export function updateUserDetails(fileReader, rootElement) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        const element = rootElement;
        element.innerHTML = fileReader.responseText;
        document.getElementById('details_username').innerHTML = userName;
    }
}

/**
 * Function to generate game details. Makes a request to local
 * filesystem for a HTML file to display.
 * @param {int} gameID - id used to create eventSource.
 * @param {HTMLElement} rootElement User details will be displayed as a child
 *     of this node.
 */
export function generateUserDetails(rootElement) {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'user-info.html', true);
    fileReader.onreadystatechange = () => updateUserDetails(fileReader, rootElement);
    fileReader.send();
    details = getCookie.checkUserDetails();
    id = details.user_id;
    userName = details.user_name;
    // console.log(`id:${id}`);

    // TODO Properties!
}


/**
 * Called when a playerTurn event happens.
 * Sets the current turn in the table to the current player.
 * Checks the users id against the turn and enables their
 * game interface if it's their turn.
 *
 * @param turnEvent The data received from the event
 */
export function turnDetails(turnEvent) {
    const turn = JSON.parse(turnEvent.data);
    document.getElementById('current-turn').innerHTML = `Player ${turn[1] + 1}`;
    // console.log(`Turn:${turn}`);
    const rollDiceButton = document.getElementById('roll-dice');
    rollDiceButton.onclick = () => { rollDice(sendJSON.sendJSON); };
    rollDiceButton.disabled = true;
    const endTurnButton = document.getElementById('end-turn');
    endTurnButton.onclick = () => { endTurn(sendJSON.sendJSON); };
    endTurnButton.disabled = true;
    // console.log(`id Test:${id}`);
    // console.log(`turn Test:${turn}`);
    if (String(turn[0]) === String(id)) {
        enableGameInterface();
    }
}

/**
 * Called when a playerBalance event happens.
 * Takes in all balance event data and checks it against the users id.
 * If there is a match it updates their id.
 *
 * @param balanceEvent The data received from the event
 */
export function balanceDetails(balanceEvent) {
    const data = JSON.parse(balanceEvent.data);
    let balance = '';
    // console.log(`Balances:${data}`);
    data.forEach((item) => {
        // console.log(item);
        if (String(item[0]) === String(id)) {
            ({1: balance} = item);
            document.getElementById('balance').innerHTML = balance;
        }
    });
}
