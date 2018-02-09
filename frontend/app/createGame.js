// Import sendJSON functionality
import * as sendJSON from './sendJSON';
import waitingGame from './pages';

// A global variable to store the function which makes the request to the server
let JSONSender = sendJSON.sendJSON;

/**
 * Callback for when game_id successfully received.
 *
 * @param {XMLHttpRequest} req1 Contains the response with the game_id.
 */
export function successCallback(req1) {
    const response = JSON.parse(req1.responseText);
    const gameID = response.game_id;
    waitingGame(gameID);
}

/**
 * Make a request for a gameID.
 *
 * @param {int} player_count The number of players in the game being created.
 * @param {Function} JSONSend The function to make the request to the server.
 */
export function getGameID(player_count = 4, JSONSend = sendJSON.sendJSON) {
    // Immediately assign JSONSend parameter to global JSONSender,
    // this is really just to make testing easier
    JSONSender = JSONSend;
    JSONSender({
        serverAddress: 'cgi-bin/allocate_game_id.py',
        jsonObject: JSON.stringify({game_size: player_count}),
        // The below line is shorthand because the object field name and the
        // actual function have the same name
        successCallback,
    });
}
