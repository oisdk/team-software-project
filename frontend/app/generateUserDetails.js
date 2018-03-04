// Imports
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';

let details = getCookie.checkUserDetails();
let id = details.user_id;
let userName = details.user_name;
let jail = false;
let jailCounter = 0;
let doubleCounter = 0;

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
 * Gives the player the option to buy a property.
 *
 * @param gameID The id of the game the player is in.
 * @param userID The user id of the player.
 * @param propertyPosition The position of the property that the player has
 *     landed on.
 */
export function enableBuyPropertyButton(gameID, userID, propertyPosition) {
    const button = document.getElementById('buy_property');
    button.disabled = false;
    button.addEventListener('click', buyProperty);

    function buyProperty() {
        sendJSON.sendJSON({
            serverAddress: 'buy_property',
            jsonObject: {
                game_id: gameID,
                user_id: userID,
                property_position: propertyPosition
            }
        });
        disableBuyPropertyButton(buyProperty);
    }
}

/**
 * Removes the option to buy a property.
 */
export function disableBuyPropertyButton(listenerFunction) {
    const button = document.getElementById('buy_property');
    button.disabled = true;
    button.removeEventListener('click', listenerFunction);
}

/**
 * Callback to check user rolls and enable end turn.
 * Enables roll-dice if a double is rolled.
 * increments/resets counter for doubles and
 * sends player to jail if 3 doubles rolled.
 * @param {XMLHttpRequest} req1 response.
 */
export function successCallback(req1) {
    console.log(req1);
    const response = JSON.parse(req1.responseText);
    const roll = response.your_rolls;
    const rollDie = document.querySelector('#roll-dice');
    if (roll[0] === roll[1] && jail === false) {
        rollDie.disabled = false;
        doubleCounter += 1;
    } else {
        rollDie.disabled = true;
        enableEndTurn();
        doubleCounter = 0;
    }
    if (doubleCounter === 3) {
        doubleCounter = 0;
        goToJail(sendJSON.sendJSON);
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
 * Function to leave jail.
 * @param {Function} JSONSend - JSON function makes testing easier.
 */
export function leaveJail(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/leave_jail.py',
        jsonObject: {player_id: id},
    });
    enableEndTurn();
}

/**
 * Function to go to jail.
 *
 * Sets jail boolean true and enables end turn.
 * @param {Function} JSONSend - JSON function makes testing easier.
 */
export function goToJail(JSONSend) {
    JSONSend({
        serverAddress: 'cgi-bin/go_to_jail.py',
        jsonObject: {player_id: id},
    });
    jail = true;
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
 * Function to generate game details. Makes a request to
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
export function displayOwnedProperties(JSONSend = sendJSON.sendJSON) {
    JSONSend({
        serverAddress: 'cgi-bin/property_state.py',
        jsonObject: {player_id: ['None', 'None', id]},
        updateDropDown,
    });
}

/**
 * Called when a playerTurn event happens.
 *
 * Sets the current turn in the table to the current player.
 * Checks the users id against the turn and enables their
 * game interface if it's their turn.
 * The dropdown item from mortgage or unmortgage is managed
 * from here
 *
 * Checks the jail counter and decides on appropriate action.
 *
 * @param turnEvent The data received from the event
 *
 * turnEvent[0] holds the players unique id.
 * turnEvent[1] holds the players position in the turn order.
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
    const leaveJailButton = document.getElementById('jail');
    leaveJailButton.onclick = () => { leaveJail(sendJSON.sendJSON); };
    leaveJailButton.disabled = true;

    // Checks if player is in jail and jailCounter is less than 3
    // enables leave jail and roll buttons
    // If jail counter is 3 enables only the leave jail button.
    // Otherwise only enable the roll button.
    if (jail === true && String(turn[0]) === String(id) && jailCounter < 3) {
        enableGameInterface();
        enableLeaveJail();
        jailCounter += 1;
    } else if (jail === true && String(turn[0]) === String(id)) {
        enableLeaveJail();
    } else if (String(turn[0]) === String(id)) {
        enableGameInterface();
    }
}

/**
 * Called when a playerBalance event happens.
 * Takes in all balance event data and checks it against the users id.
 * If there is a match it updates their id.
 *
 * @param balanceEvent The data received from the event
 *
 * balanceEvent[0] holds the players unique id.
 * balanceEvent[1] holds the players new balance.
 * balanceEvent[2] holds the amount the balance has changed by.
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
 *
 * jailEvent[0] holds the players unique id.
 * jailEvent[1] holds the players jailed status.
 */
export function jailedPlayer(jailedEvent) {
    const data = JSON.parse(jailedEvent.data);
    data.forEach((item) => {
        // console.log(item);
        if (String(item[0]) === String(id) && String(item[1]) === 'in_jail') {
            jail = true;
            enableEndTurn();
        } else if (String(item[0]) === String(id) && String(item[1]) === 'not_in_jail') {
            jail = false;
            jailCounter = 0;
        }
    });
}
