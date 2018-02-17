// Imports
import * as getCookie from './checkUserIDCookie';
import {initialiseEventSource} from './sse';

const details = getCookie.checkUserDetails();
const id = details.user_id;
const user_name = details.user_name;
/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updateUserDetails(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-left').innerHTML = fileReader.responseText;
        document.getElementById('details_username').innerHTML = user_name;
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

    // SSE Events
    const sseEventSource = initialiseEventSource(1);
    sseEventSource.addEventListener('playerTurn', (turnEvent) => {
        const turn = JSON.parse(turnEvent.data);
        document.getElementById('current-turn').innerHTML = `Player ${turn+1}`;
        console.log(`Turn:${turn}`);
    });
    sseEventSource.addEventListener('playerBalance', (balanceEvent) => {
        const data = JSON.parse(balanceEvent.data);
        let balance = "";
        console.log(`Balances:${data}`);
        data.forEach(function(item){
            console.log(item);
            if (String(item[0]) === String(id)){
                balance = item[1];
            }
        });

        document.getElementById('balance').innerHTML = balance;
    });

    // TODO Properties!
}