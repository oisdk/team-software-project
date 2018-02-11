/**
 * This module provides functions which display a certain page to the user.
 */

/**
 * Creates the html for the waiting game.
 *
 * @param gameID The id of the game.
 * @param {HTMLElement} rootElement The element to which the html is added.
 * @param {String} playerListID The id the player list element should have.
 * @param {String} startButtonID The id the start game button should have.
 */
function createWaitingGameHTML({
    gameID,
    rootElement,
    playerListID,
    startButtonID,
}) {
    while (rootElement.firstChild) {
        rootElement.firstChild.remove();
    }

    const heading = document.createElement('h1');
    heading.innerHTML = `You are in game ${gameID}`;
    const playerList = document.createElement('section');
    playerList.id = playerListID;
    const startButton = document.createElement('button');
    startButton.style.type = 'button';
    startButton.innerHTML = 'Start Game';
    startButton.id = startButtonID;
    startButton.disabled = true;

    rootElement.appendChild(heading);
    rootElement.appendChild(playerList);
    rootElement.appendChild(startButton);
}

/**
 * Displays the page for a game in a waiting state.
 *
 * @param gameID The ID of the game to display.
 */
export default function waitingGame(gameID) {
    const startButtonID = 'startButton';
    const playerListID = 'playerList';
    createWaitingGameHTML({
        gameID,
        rootElement: document.body,
        playerListID,
        startButtonID,
    });
    sseEventSource = new EventSource(`cgi-bin/game_event_source.py?game=${gameID}`);

    let numberOfPlayers = 0;

    sseEventSource.addEventListener('playerJoin', (joinEvent) => {
        const playerList = JSON.parse(joinEvent.data);
        const playerListElement = document.getElementById(playerListID);
        for (let i = 0; i < playerList.length; i += 1) {
            const player = playerList[i];
            const playerElement = document.createElement('div');
            playerElement.innerHTML = player.username;
            playerListElement.appendChild(playerElement);

            numberOfPlayers += 1;
            if (numberOfPlayers === 4) {
                document.getElementById(startButtonID).disabled = false;
            }
        }
    });
}
