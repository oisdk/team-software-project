// Imports
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';

let details = getCookie.checkUserDetails();
let id = details.user_id;
let userName = details.user_name;
let jail = false;
let jailCounter = 0;

/**
 * Function to disable game interface.
 */
export function disableGameInterface() {
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('end-turn').disabled = true;
    document.getElementById('jail').disabled = true;
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
    document.getElementById('jail').disabled = true;
}

/**
 * Function to enable leave jail functionality.
 */
export function enableLeaveJail() {
    document.getElementById('jail').disabled = false;
}

/**
 * Function to disable leave jail functionality.
 */
export function disableLeaveJail() {
    document.getElementById('jail').disabled = true;
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
 * Function to leave jail.
 * @param {Function} JSONSend - JSON function makes testing easier.
 */
export function leaveJail(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/leave_jail.py',
        jsonObject: {player_id: id},
    });
    jail = false;
    enableEndTurn();
}

/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateUserDetails(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-right').innerHTML = fileReader.responseText;
        document.getElementById('details_username').innerHTML = userName;
    }
}

/**
 * Function to generate game details. Makes a request to local
 * filesystem for a HTML file to display.
 * @param {int} gameID - id used to create eventSource.
 */
export function generateUserDetails() {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'user-info.html', true);
    fileReader.onreadystatechange = () => updateUserDetails(fileReader);
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
    document.getElementById('current-turn').innerHTML = `Player ${turn}`;
    // console.log(`Turn:${turn}`);
    const rollDiceButton = document.getElementById('roll-dice');
    rollDiceButton.onclick = () => { rollDice(sendJSON.sendJSON); };
    rollDiceButton.disabled = true;
    const endTurnButton = document.getElementById('end-turn');
    endTurnButton.onclick = () => { endTurn(sendJSON.sendJSON); };
    endTurnButton.disabled = true;
    const leaveJailButton = document.getElementById('jail');
    leaveJailButton.onclick = () => { leaveJail(sendJSON.sendJSON); };
    leaveJailButton.disabled = true;
    // console.log(`id Test:${id}`);
    // console.log(`turn Test:${turn}`);
    if (jail === true && String(turn) === String(id) && jailCounter < 3) {
        enableGameInterface();
        enableLeaveJail();
        jailCounter += 1;
    }
    else if (jail === true && String(turn) === String(id)) {
        enableLeaveJail();
    }
    else if (String(turn) === String(id)) {
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

/**
 * Called when a jailedEvent event happens.
 * Enables the button to pay to leave jail.
 *
 * @param jailedEvent The data received from the event
 */
export function jailedPlayer(jailedEvent) {
    const data = JSON.parse(jailedEvent.data);
    console.log(data);
    data.forEach((item) => {
        // console.log(item);
        if (String(item[0]) === String(id) && String(item[1]) === 'in_jail') {
            jail = true;
        }
        else if (String(item[0]) === String(id) && String(item[1]) === 'not_in_jail'){
            jail = false;
            jailCounter = 0;
        }
    });
}
