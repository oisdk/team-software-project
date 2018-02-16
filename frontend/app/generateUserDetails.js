// Imports
import * as getCookie from './checkUserIDCookie';
import {initialiseEventSource} from './sse';

const details = getCookie.checkUserDetails();
const id = details.user_id;
/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateUserDetails(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-left').innerHTML = fileReader.responseText;
    }
}

/**
 * Function to generate game details. Makes a request to local
 * filesystem for a HTML file to display.
 * @param {int} gameID - id used to create eventSource.
 */
export function generateUserDetails(gameID) {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'user-info.html', true);
    fileReader.onreadystatechange = () => updateUserDetails(fileReader);
    fileReader.send();

    document.getElementById('username').innerHTML = details.user_name;

    // SSE Events
    const sseEventSource = initialiseEventSource(gameID);
    sseEventSource.addEventListener('playerTurn', (turnEvent) => {
        const turn = JSON.parse(turnEvent.data);
        document.getElementById('current-turn').innerHTML = `Player ${turn}`;
    });
    sseEventSource.addEventListener('playerBalance', (balanceEvent) => {
        const balance = JSON.parse(balanceEvent.data);
        document.getElementById('current-turn').innerHTML = balance[id];
    });

    // TODO Properties!
}
