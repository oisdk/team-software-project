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
 * Enables roll-dice if a double is rolled.
 * @param {XMLHttpRequest} req1 response.
 */
export function successCallback(req1) {
    console.log(req1);
    const response = JSON.parse(req1.responseText);
    const roll = response.your_rolls;
    const rollDie = document.querySelector('#roll-dice');
    if (roll[0] === roll[1]) {
        rollDie.disabled = false;
    } else {
        rollDie.disabled = true;
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
 * Function to update properties displayed on the
 * drop downs.
 * @param req - Response from server-side.
 */
export function updateDropDown(req) {
    const request = JSON.parse(req.responseText);
    const names = ['mortgage', 'unmortgage'];
    const options = [request.mortgage, request.unmortgage];
    let select;
    let propertyNames;
    for (let i = 0; i < names.length; i += 1) {
        select = document.getElementById(names[i]);
        propertyNames = options[i];

        for (let j = 0; j < propertyNames.length; j += 1) {
            const option = document.createElement('option');

            // set values for option
            option.setAttribute('value', propertyNames[j]);
            option.innerHTML = propertyNames[j];

            // add option to the select
            select.appendChild(option);
        }
    }
}

/**
 * Called when a mortgage/unmortgage button is presses.
 * Calls function which handles property state and player
 * Result is list of properties by property_state
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @param {Object} button - Object of the button pressed.
 * @param {String} state - The initial state of a property.
 */
export function changePropState(JSONSend, button, state) {
    const optionIndex = button.selectedIndex;
    // This gets the name by the index of the property name selected
    // from the property options
    const propertyName = optionIndex.options[optionIndex.selectedIndex].value;
    JSONSend({
        serverAddress: 'cgi-bin/property_state.py',
        jsonObject: {player_id: [state, propertyName, id]},
        updateDropDown,
    });
}

/**
 * Called at the start of turn to display the properties owned by the
 * player allowing to be mortgaged or unmortgaged.
 *
 * @param {Function} JSONSend - JSON function makes testing easier.

 */
export function displayOwnedProperties(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/property_state.py',
        jsonObject: {player_id: ['None', 'None', id]},
        updateDropDown,
    });
}

/**
 * Called when a playerTurn event happens.
 * Sets the current turn in the table to the current player.
 * Checks the users id against the turn and enables their
 * game interface if it's their turn.
 * The dropdown item from mortgage or unmortgage is managed
 * from here
 *
 * @param turnEvent The data received from the event
 */
export function turnDetails(turnEvent) {
    const turn = JSON.parse(turnEvent.data);
    document.getElementById('current-turn').innerHTML = `Player ${turn[0] + 1}`;
    // console.log(`Turn:${turn}`);

    // displayOwnedProperties(sendJSON.sendJSON);

    const rollDiceButton = document.getElementById('roll-dice');
    rollDiceButton.onclick = () => { rollDice(sendJSON.sendJSON); };
    rollDiceButton.disabled = true;

    const mortgageButton = document.getElementById('mort-check');
    mortgageButton.onclick = () => { changePropState(sendJSON.sendJSON, mortgageButton, 'unmortgage'); };
    const unmortgageButton = document.getElementById('unmort-check');
    unmortgageButton.onclick = () => { changePropState(sendJSON.sendJSON, unmortgageButton, 'mortgage'); };

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
