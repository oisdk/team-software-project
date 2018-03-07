/**
 * Creates a page where the user can join a game or create a new game.
 * @module
 */

// Import functionality which can read cookie values from browser cookie arrays
import * as checkUserIDCookie from './checkUserIDCookie';
// Import pickGame functionality
import * as pickGame from './pickGame';
// Import createGame functionality
import * as createGame from './createGame';


/**
 * Callback function to update HTML body with file's contents.
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 * @private
 */
export function updatePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.getElementById('content').innerHTML = fileReader.responseText;
        const username = checkUserIDCookie.getCookieValue(document.cookie.split('; '), 'user_name');
        // Get the username (displayed in italics) field in the page's heading
        const usernameField = document.querySelector('#username');
        // Update the username field to include the player's username
        usernameField.innerHTML = username;
        const joinGameButton = document.getElementById('join-game');
        joinGameButton.addEventListener('click', pickGame.requestGameList, false);
        const createGameButton = document.getElementById('create-game');
        createGameButton.addEventListener('click', createGame.getGameID, false);
    }
}

/**
 * Function to generate create game / join game page. Makes a request to local
 * filesystem for a HTML file to display.
 */
export function generateCreateJoinGamePage() {
    // Generate a HTML page with buttons to load the "create new game" page
    // or "join existing game" page
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'create-join-game.html', true);
    fileReader.onreadystatechange = () => updatePage(fileReader);
    fileReader.send();
}
