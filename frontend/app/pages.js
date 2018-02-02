import {sendJSON} from './sendJSON';
/**
 * This module provides functions which display a certain page to the user.
 */

/**
 * Displays the page for a game in a waiting state.
 *
 * @param gameID The ID of the game to display.
 */
export function waitingGame(gameID) {
    const rootElement = document.body;
    sendJSON({
        serverAddress: 'cgi-bin/get_game_details.py',
        jsonObject: {'gameID': gameID},
        successCallback: function(request) {
            rootElement.innerHTML = request.responseText;
        }
    });
}
