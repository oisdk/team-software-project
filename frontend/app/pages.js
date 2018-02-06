import {sendJSON} from './sendJSON';
/**
 * This module provides functions which display a certain page to the user.
 */

/**
 * Displays the page for a game in a waiting state.
 *
 * @param gameID The ID of the game to display.
 */
export default function waitingGame(gameID) {
    const rootElement = document.querySelector('#content');
    sendJSON({
        serverAddress: 'cgi-bin/get_game_details.py',
        jsonObject: {gameID},
        successCallback(request) {
            rootElement.innerHTML = `You are in the waiting game ${gameID}.
            Here are the details:
            ${request.responseText}`;
        },
    });
}
