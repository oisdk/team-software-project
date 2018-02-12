// Import sendJSON functionality
import * as sendJSON from './sendJSON';
import * as getCookie from './checkUserIDCookie';

/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updatePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content-right').innerHTML = fileReader.responseText;
        const rollDiceButton = document.getElementById('roll-dice');
        rollDiceButton.addEventListener('click', rollDice, false);
        //const endTurnButton = document.getElementById('end-turn');
        //createGameButton.addEventListener('click', createGame.getGameID, false);
    }
}

/**
 * Function to generate game interface. Makes a request to local
 * filesystem for a HTML file to display.
 */
export function generateGameInterface() {
    // Generate a HTML page with user interface
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'game-interface.html', true);
    fileReader.onreadystatechange = () => updatePage(fileReader);
    fileReader.send();
}

/**
 * Function to call the roll_dice on the server side.
 */
export function rollDice(){
    const details = getCookie.checkUserDetails();
    const id = details.user_id;
    sendJSON.sendJSON({
        serverAddress: 'cgi-bin/roll_dice.py',
        jsonObject: {user_id: id},
        successCallback,
    });
    
}

/**
 * Callback for when game_id successfully received.
 *
 * @param {XMLHttpRequest} req1 Contains the response with the game_id.
 */
export function successCallback(req1) {
    const response = JSON.parse(req1.responseText);
    console.log(response);
}

/**
 * Function to call to end a players turn.
 */
export function endTurn(){
    
}

