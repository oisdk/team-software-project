// Imports
import {getEventSource} from './sse';


/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateLogPage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-left').innerHTML = fileReader.responseText;
        document.getElementById('game-log').scrollTop = document.getElementById('game-log').scrollHeight;
    }
}

/**
 * Function to append data to the game log.
 * @param {String} data - data to append.
 */
export function updateGameLog(data) {
    document.getElementById('game-log').value += data;
    document.getElementById('game-log').value += '\n';
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
 * @param {data} turnEvent - data used to generate event.
 */
export function logTurnEvent(turnEvent){
    const turn = JSON.parse(turnEvent.data);
    const outputString = `Player ${turn + 1}'s Turn`;
    updateGameLog(outputString);
}

/**
 * Function to update game log for move event.
 * @param {data} moveEvent - data used to generate event.
 */
export function logMoveEvent(moveEvent){
    const move = JSON.parse(moveEvent.data);
    if (move[0][2] !== 0) {
        const outputString = `Player ${move[0][0]} Rolled a ${move[0][2]}`;
        updateGameLog(outputString);
    }
}

/**
 * Function to update game log for balance event.
 * @param {data} balanceEvent - data used to generate event.
 */
export function logBalanceEvent(balanceEvent){
    const balance = JSON.parse(balanceEvent.data);
    if (balance[0][1] !== 200 && balance[0][2] !== 0) {
        const outputString = `Player ${balance[0][0]} Got ${balance[0][2]}`;
        updateGameLog(outputString);
    }
}
