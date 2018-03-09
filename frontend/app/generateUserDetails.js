/**
 * Manages a pane in an active game that displays the user’s game data.
 * @module
 */
// Imports
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';
import {updateGameLog} from './generateGameLog';

let details = getCookie.checkUserDetails();
let id = details.user_id;
let userName = details.user_name;
let jail = false;
let jailCounter = 0;
let doubleCounter = 0;

/**
 * Function to disable game interface.
 *
 * @private
 */
export function disableGameInterface() {
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('end-turn').disabled = true;
    document.getElementById('jail').disabled = true;
    document.getElementById('buy-house').disabled = true;
}

/**
 * Function to enable game interface.
 *
 * @private
 */
export function enableGameInterface() {
    document.getElementById('roll-dice').disabled = false;
    document.getElementById('end-turn').disabled = true;
    document.getElementById('buy-house').disabled = false;
}

/**
 * Function to enable end-turn functionality.
 *
 * @private
 */
export function enableEndTurn() {
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('end-turn').disabled = false;
    document.getElementById('jail').disabled = true;
}

/**
 * Function to enable leave jail functionality.
 *
 * @private
 */
export function enableLeaveJail() {
    document.getElementById('jail').disabled = false;
}

/**
 * Function to disable leave jail functionality.
 *
 * @private
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
            serverAddress: 'cgi-bin/buy_property.py',
            jsonObject: {
                game_id: gameID,
                user_id: userID,
                property_position: propertyPosition,
            },
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
 * Callback to check user rolls and enable end turn. Also displays chance and
 * community chest card details to the client.
 * Enables roll-dice if a double is rolled.
 * increments/resets counter for doubles and
 * sends player to jail if 3 doubles rolled.
 *
 * @param {XMLHttpRequest} req1 response.
 * @private
 */
export function successCallback(req1, logUpdater = updateGameLog) {
    console.log(req1);
    const response = JSON.parse(req1.responseText);
    const roll = response.your_rolls;
    // Get the description of the card that was landed on
    const cardDetails = response.card_details;

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
    if (cardDetails !== null) {
        logUpdater('Activated card details:');
        logUpdater(cardDetails);
    }
}

/**
 * Function to call the roll_dice on the server side.
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @private
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
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @private
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
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @private
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
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @private
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
 *
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 * @private
 */
export function updateUserDetails(fileReader) {
    document.getElementById('content-right').innerHTML = fileReader.responseText;
    document.getElementById('details_username').innerHTML = userName;
}

/**
 * Function to generate game details. Makes an AJAX request for the html to display.
 *
 * @param {function} htmlLoadedCallback A callback to call once the html has loaded.
 */
export function generateUserDetails(htmlLoadedCallback) {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'user-info.html', true);
    fileReader.onreadystatechange = () => {
        if (fileReader.status === 200 && fileReader.readyState === 4) {
            updateUserDetails(fileReader);
            htmlLoadedCallback();
        }
    };
    fileReader.send();
    details = getCookie.checkUserDetails();
    id = details.user_id;
    userName = details.user_name;
}

/**
 * Function to update properties displayed on the
 * drop downs.
 *
 * @param req - Response from server-side.
 * @private
 */
export function updateDropDown(req) {
    const request = JSON.parse(req.responseText);
    console.log(`Response:${request}`);
    const names = ['mortgage', 'unmortgage', 'properties-house'];
    const options = [request.mortgage, request.unmortgage, request.mortgage];
    let select;
    let propertyNames;
    for (let i = 0; i < names.length; i += 1) {
        select = document.getElementById(names[i]);
        select.innerHTML = '';
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
 * @private
 */
export function changePropState(JSONSend, button, state) {
    const optionIndex = button.selectedIndex;
    // This gets the name by the index of the property name selected
    // from the property options
    const propertyName = optionIndex.options[optionIndex.selectedIndex].value;
    JSONSend({
        serverAddress: 'cgi-bin/property_state.py',
        jsonObject: {player_id: [state, propertyName, id]},
        successCallback: updateDropDown,
    });
}

/**
 * Called at the start of turn to display the properties owned by the
 * player allowing to be mortgaged or unmortgaged.
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @private
 */
export function displayOwnedProperties(JSONSend = sendJSON.sendJSON) {
    JSONSend({
        serverAddress: 'cgi-bin/property_state.py',
        jsonObject: {player_id: ['None', 'None', id]},
        successCallback: updateDropDown,
    });
}

/**
 * Called when the buy house button is presses.
 *
 * @param {Function} JSONSend - JSON function makes testing easier.
 * @param {Object} button - Object of the button pressed.
 */
export function buyHouse(JSONSend) {
    const buyButton = document.getElementById('properties-house');
    // This gets the name by the index of the property name selected
    // from the property options
    const propertyName = buyButton.options[buyButton.selectedIndex].value;
    JSONSend({
        serverAddress: 'cgi-bin/buy_house.py',
        jsonObject: {player_id: id, property_name: propertyName},
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
 * @param turnData The data received from the event, with the player’s username and id.
 *     Example format: {'name': Alex, 'id': 4}
 */

export function turnDetails(turnData) {
    document.getElementById('current-turn').innerHTML = `${turnData.name}`;
    // console.log(`Turn:${turn}`);

    displayOwnedProperties(sendJSON.sendJSON);

    const rollDiceButton = document.getElementById('roll-dice');
    rollDiceButton.onclick = () => { rollDice(sendJSON.sendJSON); };
    rollDiceButton.disabled = true;

    const mortgageButton = document.getElementById('mort-check');
    mortgageButton.onclick = () => { changePropState(sendJSON.sendJSON, mortgageButton, 'unmortgage'); };
    const unmortgageButton = document.getElementById('unmort-check');
    unmortgageButton.onclick = () => { changePropState(sendJSON.sendJSON, unmortgageButton, 'mortgage'); };

    const buyHouseButton = document.getElementById('buy-house');
    buyHouseButton.onclick = () => { buyHouse(sendJSON.sendJSON); };

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
    if (jail === true && String(turnData.id) === String(id) && jailCounter < 3) {
        enableGameInterface();
        enableLeaveJail();
        jailCounter += 1;
    } else if (jail === true && String(turnData.id) === String(id)) {
        enableLeaveJail();
    } else if (String(turnData.id) === String(id)) {
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
    data.forEach((item) => {
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
        if (String(item[0]) === String(id) && String(item[1]) === 'in_jail') {
            jail = true;
            enableEndTurn();
        } else if (String(item[0]) === String(id) && String(item[1]) === 'not_in_jail') {
            jail = false;
            jailCounter = 0;
        }
    });
}
