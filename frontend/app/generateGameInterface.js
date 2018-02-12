// Import sendJSON functionality
import * as sendJSON from './sendJSON';

/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updatePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementByID('roll-dice').innerHTML = fileReader.responseText;
        const rollDiceButton = document.getElementById('roll-dice');
        joinGameButton.addEventListener('click', sendJSON.sendJSON({
        serverAddress: 'cgi-bin/roll_dice.py',
        jsonObject: {host_id: id, game_size: player_count},
        //Call To Update Board,
    });, false);
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