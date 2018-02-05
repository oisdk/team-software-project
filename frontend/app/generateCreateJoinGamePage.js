// Import functionality which can read cookie values from browser cookie arrays
import * as checkUserIDCookie from './checkUserIDCookie';
// Import pickGame functionality
import * as pickGame from './pickGame';
// Import sendJSON functionality
import sendJSON from './sendJSON';

/**
 * @param {XMLHttpRequest} fileReader - Contains local file with HTML to display.
 */
export function updatePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.body.innerHTML = fileReader.responseText;
        const username = checkUserIDCookie.getCookieValue(document.cookie.split('; '), 'user_name');
        // Get the username (displayed in italics) field in the page's heading
        const usernameField = document.querySelector('#username');
        // Update the username field to include the player's username
        usernameField.innerHTML = username;
        const joinGameButton = document.getElementById('join-game');
        joinGameButton.addEventListener('click', pickGame.requestGameList, false);
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
    document.getElementById('create-game').onclick = () => {
        sendJSON({
            serverAddress: 'cgi-bin/allocate_game_id.py',
            jsonObject: JSON.dumps({game_size: 4}),
            successCallback: (req) => {
                const response = JSON.load(req.responseText);
                const gameID = response.game_id;
                sendJSON({
                    serverAddress: 'cgi-bin/waiting_game.py', jsonObject: JSON.dumps({gameID}),
                    /*
                    successCallback: (req) => {
                        const response_success = JSON.load(req.responseText)
                        sendJSON({'cgi-bin/waiting_game.py',
                        JSON.dumps({})
                        })
                    }
                    */});
            },
        });
    };
}
