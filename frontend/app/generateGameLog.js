/**
 * Callback function to update HTML body with file's contents.
 *
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
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
 * @param {int} gameID - id used to create eventSource.
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
 * @param {data} turnEvent - data used to generate event.
 */
export function logTurnEvent(turnEvent) {
    const turn = JSON.parse(turnEvent.data);
    const outputString = `Player ${turn[1] + 1}'s Turn`;
    updateGameLog(outputString);
}

/**
 * Function to update game log for move event.
 *
 * @param {data} moveEvent - data used to generate event.
 */
export function logMoveEvent(moveEvent) {
    const move = String(JSON.parse(moveEvent.data));
    const items = move.split(',');
    let roll = '';
    if (items[2] !== 0) {
        if (parseInt(items[2], 10) > parseInt(items[1], 10)) {
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
 */
export function logBalanceEvent(balanceEvent) {
    const balance = JSON.parse(balanceEvent.data);
    if (balance[0][1] !== 1500 && balance[0][2] !== 0) {
        const outputString = `Player ${balance[0][0]} Got ${balance[0][2]}`;
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
            outputString = `Player ${property[i].newOwner} Bought ${property[i].property}`;
        } else {
            outputString = `Player ${property[i].newOwner} Got ${property[i].property} from ${property[i].oldOwner}`;
        }
        updateGameLog(outputString);
    }
}
