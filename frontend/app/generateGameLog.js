/**
 * Manages a game log that describes what’s happening in the game.
 * @module
 */

/**
 * Callback function to update HTML body with file's contents.
 *
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 * @private
 */
export function updateLogPage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-left').innerHTML = fileReader.responseText;
    }
}

/**
 * Function to append data to the game log.
 *
 * @param {String} data - data to append.
 */
export function updateGameLog(data) {
    const gameLog = document.getElementById('game-log');
    gameLog.value += data;
    gameLog.value += '\n';
    gameLog.scrollTo(0, gameLog.scrollHeight);
}

/**
 * Function to generate game log. Makes a request to local
 * filesystem for a HTML file to display.
 *
 * @private
 */
export function generateGameLog() {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'game-log.html', true);
    fileReader.onreadystatechange = () => updateLogPage(fileReader);
    fileReader.send();
}

// SSE Event Functions
/**
 * Function to update game log for turn event.
 *
 * @param {data} turnData - data used to generate event.
 * turnEvent[0] holds the players unique id.
 * turnEvent[1] holds the players position in the turn order.
 */
export function logTurnEvent(turnData) {
    const outputString = `${turnData.name}'s Turn`;
    updateGameLog(outputString);
}

/**
 * Function to update game log for move event.
 *
 * Checks if the player is in jail and does not update the log.
 * Checks if the player has passed go and updates the log appropriately.
 *
 * @param {data} moveEvent - data used to generate event.
 *
 * moveEvent[0] holds the players unique id.
 * moveEvent[1] holds the players new board position.
 * moveEvent[2] holds the players old board position.
 * moveEvent[3] holds the players jailed status.
 */
export function logMoveEvent(moveEvent) {
    const move = String(JSON.parse(moveEvent.data));
    // console.log(`Move:${move}`);
    const items = move.split(',');
    let roll = '';
    if (parseInt(items[2], 10) !== -1 && items[3] !== 'in_jail') {
        if (parseInt(items[1], 10) < parseInt(items[2], 10)) {
            roll = items[1] - (items[2] - 40);
        } else {
            roll = items[1] - items[2];
        }
        const outputString = `Player ${items[0]} Rolled ${roll}`;
        updateGameLog(outputString);
    }
}

/**
 * Function to update game log for balance event.
 *
 * @param {data} balanceEvent - data used to generate event.
 *
 * balanceEvent[0] holds the players unique id.
 * balanceEvent[1] holds the players new balance.
 * balanceEvent[2] holds the amount the balance has changed by.
 */
export function logBalanceEvent(balanceEvent) {
    const balance = JSON.parse(balanceEvent.data);
    let outputString = '';
    if (balance[0][1] !== 1500 && balance[0][2] !== 0) {
        if (balance[0][2] > 0) {
            outputString = `Player ${balance[0][0]} Balance + ${balance[0][2]}`;
        } else {
            outputString = `Player ${balance[0][0]} Balance ${balance[0][2]}`;
        }
        updateGameLog(outputString);
    }
}

/**
 * Function to update game log for properties events.
 *
 * If the old owner is null output the player bought a property,
 * otherwise output the player that the property was gotten from.
 *
 * @param {data} propertyEvent - data used to generate event.
 */
export function logPropertyEvent(propertyEvent) {
    const property = JSON.parse(propertyEvent.data);
    // console.log(`Property: ${property}`);
    let outputString;
    for (let i = 0; i < property.length; i += 1) {
        if (property[i].oldOwner === null) {
            outputString = `${property[i].newOwner.name} bought ${property[i].property.name}`;
        } else {
            outputString = `${property[i].newOwner.name} got ${property[i].property.name} from ${property[i].oldOwner.name}`;
        }
        updateGameLog(outputString);
    }
}

/**
 * Function to update game log for jail event.
 *
 * @param {data} jailEvent - data used to generate event.
 *
 * jailEvent[0] holds the players unique id.
 * jailEvent[1] holds the players jailed status.
 */
export function logJailEvent(jailEvent) {
    const data = String(JSON.parse(jailEvent.data));
    const items = data.split(',');
    // console.log(data);
    let outputString = `Player ${items[0]} `;
    if (items[1] === 'in_jail') {
        outputString += 'went to jail';
    } else {
        outputString += 'got out of jail';
    }
    updateGameLog(outputString);
}
