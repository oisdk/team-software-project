/**
 * Handles user interaction during a game that has started.
 * @module
 */
import * as generateUserDetails from './generateUserDetails';
import * as control from './moveFunctions';
import {getEventSource} from './sse';
import * as logEvents from './generateGameLog';
import {OwnedPropertiesView} from './ownedPropertiesView';

const playerTokenInformation = {};
const playerPositions = {}; // value id : position on board ie previous position.
let timer = '';
let currentPlayer = '';
let propertyView;

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID, playerList) {
    const rightPane = document.getElementById('content-right');
    const userDetailsPane = document.createElement('div');
    const propertiesPane = document.createElement('div');
    rightPane.appendChild(userDetailsPane);
    rightPane.appendChild(propertiesPane);

    // display board and assign starting positions.
    displayBoard(playerList);
    generateUserDetails.generateUserDetails(userDetailsPane);
    logEvents.generateGameLog();
    propertyView = new OwnedPropertiesView(propertiesPane);
    enableActiveGameListeners();
}


/**
 * Called when a playerMove event happens.
 * Moves the player location on the board using the received data.
 * Logs this move in the game log.
 * Checks if the playr is in/has left jail and deals with this
 * appropriately in the animation.
 *
 * @param playerMoveEvent The data received from the event
 *
 * moveEvent[0] holds the players unique id.
 * moveEvent[1] holds the players new board position.
 * moveEvent[2] holds the players old board position.
 * moveEvent[3] holds the players jailed status.
 */
export function onPlayerMove(playerMoveEvent) {
    let endPosition = '';
    logEvents.logMoveEvent(playerMoveEvent);
    const move = String(JSON.parse(playerMoveEvent.data));
    const items = move.split(',');
    // console.log(playerMoveEvent);

    // had to assign variables to stop linter from complaining.
    const player = items[0];
    currentPlayer = player;
    if (items[2] === '-1') {
        playerPositions[currentPlayer].current = 9;
    }
    if (items[1] === '-1') {
        endPosition = 99;
    } else {
        const endPositionValue = items[1];
        endPosition = endPositionValue;
    }
    playerPositions[currentPlayer].end = parseInt(endPosition, 10);
    startAnimation();
}

/**
 * Called when a playerTurn event happens.
 * Calls the function to update the player turn.
 * Logs this turn in the game log
 *
 * @param playerTurnEvent The data received from the event
 */
function onPlayerTurn(playerTurnEvent) {
    generateUserDetails.turnDetails(playerTurnEvent);
    logEvents.logTurnEvent(playerTurnEvent);
}

/**
 * Called when a playerBalance event happens.
 * Calls the function to update the player balance.
 * Logs this balance change in the game log
 *
 * @param playerBalanceEvent The data received from the event
 */
function onPlayerBalance(playerBalanceEvent) {
    generateUserDetails.balanceDetails(playerBalanceEvent);
    logEvents.logBalanceEvent(playerBalanceEvent);
}

/**
 * Called when a playerJailed event happens.
 * Calls the function to update the player jailed attributes.
 *
 * @param playerJailedEvent The data received from the event
 */
export function onPlayerJailed(playerJailedEvent) {
    generateUserDetails.jailedPlayer(playerJailedEvent);
    logEvents.logJailEvent(playerJailedEvent);
}

/*
 * Called when a propertyOwnerChanges event happens, and passes the data to
 * the property view.
 *
 * @param {event} changesEvent The event that occurred.
 */
function onPropertyOwnerChanges(changesEvent) {
    propertyView.update(JSON.parse(changesEvent.data));
    logEvents.logPropertyEvent(changesEvent);
}

function onWin(playerBalanceEvent) {
    console.log("winner");
}

/**
 * Function for displaying the monopoly board onscreen.
 * @param playerList The list of players in the game
 */
export function displayBoard(playerList) {
    let tokenSelector = 0;
    const images = ['hat.png', 'car.png', 'ship.png', 'duck.png'];
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="position: absolute; left: 0 ; top: 0 ;z-index : 0;"></canvas>';
    // need a layer to display strictly hotels and houses
    createCanvas('buildingLayer', 'content', 1);

    // creates a canvas with player id and layer i.
    // layer 0 = background image, layer 1 = houses/hotels, last layer = game info
    // creates a token for each player on their canvas.
    for (let i = 0; i < playerList.length; i += 1) {
        createCanvas(playerList[i], 'content', i + 2);
        playerTokenInformation[String(playerList[i])] = images[tokenSelector];
        // contains { playerID : { currentPosition : 0, destinationPosition } }
        playerPositions[String(playerList[i])] = {current: 0, end: 0};
        control.movePlayer(playerList[i], 0, playerTokenInformation[playerList[i]]);
        tokenSelector += 1;
    }
    createCanvas('game-info', 'content', playerList + 2);
    const c = document.getElementById('gameBoard');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
    img.src = 'uk.jpg';
}

/**
 * A function that creates a canvas and appends to a a given node.
 *
 * @param {string} canvasID - id of canvas.
 * @param {string} appendToNode - id of node to append to.
 * @param {number} layerNumber - z-index of the canvas.
 */
function createCanvas(canvasID, appendToNode, layerNumber) {
    const canvas = document.createElement('canvas');
    canvas.id = canvasID;
    canvas.height = 800;
    canvas.width = 800;
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.zIndex = layerNumber;
    document.getElementById(appendToNode).append(canvas);
}


function enableActiveGameListeners() {
    const eventSource = getEventSource();
    eventSource.addEventListener('playerMove', onPlayerMove);
    eventSource.addEventListener('playerTurn', onPlayerTurn);
    eventSource.addEventListener('playerBalance', onPlayerBalance);
    eventSource.addEventListener('playerJailed', onPlayerJailed);
    eventSource.addEventListener('propertyOwnerChanges', onPropertyOwnerChanges);
    eventSource.addEventListener('gameEnd', disableActiveGameListeners);
}

function disableActiveGameListeners(_gameEndEvent) {
    const eventSource = getEventSource();
    eventSource.removeEventListener('playerMove', onPlayerMove);
    eventSource.removeEventListener('playerTurn', onPlayerTurn);
    eventSource.removeEventListener('playerBalance', onPlayerBalance);
    eventSource.removeEventListener('propertyOwnerChanges', onPropertyOwnerChanges);
    eventSource.removeEventListener('gameEnd', disableActiveGameListeners);
}

/**
 * A function to start the animation of a players token.
 *
 */
function startAnimation() {
    timer = setInterval(animate, 500);
}

/**
 * A function that animates the movement of a players token around
 * the board. When position 39 on the board is reached, it will continue
 * to wrap around the board.
 */
function animate() {
    if (playerPositions[currentPlayer].end !== 99) {
        playerPositions[currentPlayer].current += 1;
        let nextPosition = playerPositions[currentPlayer].current;

        if (nextPosition > 39) {
            nextPosition -= 40;
            playerPositions[currentPlayer].current = nextPosition;
        }
        control.movePlayer(currentPlayer, nextPosition, playerTokenInformation[currentPlayer]);
        if (playerPositions[currentPlayer].current === playerPositions[currentPlayer].end) {
            clearInterval(timer);
            console.log('ended');
            currentPlayer = '';
        }
    } else {
        // go to jail.
        control.movePlayer(currentPlayer, 99, playerTokenInformation[currentPlayer]);
        playerPositions[currentPlayer].current = 99;
        clearInterval(timer);
        console.log('Jailed 99');
        currentPlayer = '';
    }
}
