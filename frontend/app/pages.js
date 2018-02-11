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
    const startButtonID = 'startButton';
    const playerListID = 'playerList';
    createHTML({
        gameID,
        rootElement: document.body,
        playerListID,
        startButtonID,
    });
    sseEventSource = new EventSource(`cgi-bin/game_event_source.py?game=${gameID}`);

    sseEventSource.addEventListener('playerJoin', (joinEvent) => {
        const playerList = JSON.parse(joinEvent.data);
        const playerListElement = document.getElementById(playerListID);
        for (player of playerList) {
            const playerElement = document.createElement('div');
            playerElement.innerHTML = player.username;
            playerListElement.appendChild(playerElement);
        }
    });
}

/**
 * Creates the html for the waiting game.
 *
 * @param gameID The id of the game.
 * @param {HTMLElement} rootElement The element to which the html is added.
 * @param {String} playerListID The id the player list element should have.
 * @param {String} startButtonID The id the start game button should have.
 */
function createHTML({gameID, rootElement, playerListID, startButtonID}) {
    while (rootElement.firstChild) {
        rootElement.firstChild.remove();
    }

    const heading = document.createElement('h1');
    heading.innerHTML = `You are in game ${gameID}`;
    const playerList = document.createElement('section');
    playerList.id = playerListId;
    const startButton = document.createElement('button');
    startButton.style.type = 'button';
    startButton.innerHTML = 'Start Game';
    startButton.id = startButtonID;
    startButton.disabled = true;

    rootElement.appendChild(heading);
    rootElement.appendChild(playerList);
    rootElement.appendChild(startButton);
}
