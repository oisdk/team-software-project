/**
 * Handles user interaction during a game that is waiting to start.
 * @module
 */
import {initialiseEventSource} from './sse';
import * as sendJSON from './sendJSON';
import {removeChildren} from './html';

// change according to activeGame as currently used with default function
import {activeGame} from './activeGame';

const playersInGame = [];

/**
 * Creates the html for the waiting game.
 *
 * @param gameID The id of the game.
 * @param {HTMLElement} rootElement The element to which the html is added.
 * @param {String} playerListID The id the player list element should have.
 * @param {String} startButtonID The id the start game button should have.
 * @private
 */
function createWaitingGameHTML({
    gameID,
    rootElement,
    playerListID,
    startButtonID,
}) {
    removeChildren(rootElement);

    const heading = document.createElement('h1');
    heading.innerHTML = `You are in game ${gameID}`;
    const playerList = document.createElement('section');
    playerList.id = playerListID;
    const startButton = document.createElement('button');
    startButton.style.type = 'button';
    startButton.className = 'btn btn-lg btn-outline-success';
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
export function waitingGame(gameID) {
    const startButtonID = 'startButton';
    const playerListID = 'playerList';
    createWaitingGameHTML({
        gameID,
        rootElement: document.getElementById('content'),
        playerListID,
        startButtonID,
    });

    // Initialise an event source from where server-sent events will come.
    // See the sse.js file for more details.
    const sseEventSource = initialiseEventSource(gameID);
    // Listen for a playerJoin event coming from the server
    sseEventSource.addEventListener('playerJoin', onPlayerJoin);
    // Listen for a gameStart event coming from the server.
    sseEventSource.addEventListener('gameStart', onGameStart);

    let numberOfPlayers = 0;
    function onPlayerJoin(joinEvent) {
        // Parse the "data" portion of the server-sent event from the server
        // which should contain the list of new users who have joined the
        // waiting game lobby.
        const playerList = JSON.parse(joinEvent.data);
        const playerListElement = document.getElementById(playerListID);

        for (let i = 0; i < playerList.length; i += 1) {
            const player = playerList[i];
            if (!playersInGame.includes(player)) {
                const playerElement = document.createElement('div');
                playerElement.innerHTML = player;
                playerListElement.appendChild(playerElement);
                numberOfPlayers += 1;
            }
            playersInGame.push(player);
        }

        // Only enable the "start game" button when 4 players have joined
        if (numberOfPlayers === 2) {
            document.getElementById(startButtonID).disabled = false;
            // Add an event listener to the "start game" button which makes
            // a request to start-game.py to update the status of this game
            // to "playing".
            document.getElementById(startButtonID).addEventListener('click', () => {
                sendJSON.sendJSON({
                    serverAddress: 'cgi-bin/start-game.py',
                    jsonObject: {game_id: gameID},
                });
            });
        }
    }

    function startGame({request, startEvent}) {
        const playerList = JSON.parse(request.responseText);
        // call active game with these values
        activeGame({
            playerList,
            startEvent,
        });
    }

    function onGameStart(startEvent) {
        sseEventSource.removeEventListener('playerJoin', onPlayerJoin);
        sseEventSource.removeEventListener('gameStart', onGameStart);
        sendJSON.sendJSON({
            serverAddress: 'cgi-bin/request_players.py',
            jsonObject: {game_id: gameID},
            successCallback: request => startGame({
                request,
                startEvent,
            }),
        });
    }
}

/**
 * These are private functions exported for testing purposes.
 *
 * @private
 */
export const privateFunctions = {
    createWaitingGameHTML,
};
