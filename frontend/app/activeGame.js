import * as generateUserDetails from './generateUserDetails';
import * as control from './moveFunctions';
import {getEventSource} from './sse';
import * as logEvents from './generateGameLog';

const playerTokenInformation = {};
const playerPositions = {}; // value id : position on board ie previous position.
let timer = '';
let currentPlayer = '';

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID, playerList) {
    // display board and assign starting positions.
    displayBoard(playerList);
    generateUserDetails.generateUserDetails();
    logEvents.generateGameLog();
    enableActiveGameListeners();
}


/**
 * Called when a playerMove event happens.
 * Moves the player location on the board using the received data.
 * Logs this move in the game log.
 *
 * @param playerMoveEvent The data received from the event
 */
export function onPlayerMove(playerMoveEvent) {
    logEvents.logMoveEvent(playerMoveEvent);
    const move = String(JSON.parse(playerMoveEvent.data));
    const items = move.split(',');
    // console.log(playerMoveEvent);
    // had to add these in because litner was complaining,
    // says  'Use array destructuring' but i cant get it to work.
    const player = items[0];
    currentPlayer = player;
    const endPosition = items[1];
    playerPositions[currentPlayer].end = parseInt(endPosition, 10);
    startAnimation();
    // control.movePlayer(items[0], items[1], playerTokenInformation);
}

/**
 * Called when a playerTurn event happens.
 * Calls the function to update the player turn.
 * Logs this turn in the game log
 *
 * @param playerTurnEvent The data received from the event
 */
export function onPlayerTurn(playerTurnEvent) {
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
export function onPlayerBalance(playerBalanceEvent) {
    generateUserDetails.balanceDetails(playerBalanceEvent);
    logEvents.logBalanceEvent(playerBalanceEvent);
}

/**
 * Function for displaying the monopoly board onscreen.
 * @param playerList The list of players in the game
 */

export function displayBoard(playerList) {
    let tokenSelector = 0;
    const images = ['hat.png', 'car.png', 'ship.png', 'duck.png'];
    // console.log('displayBoard called');
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="position: absolute; left: 0 ; top: 0 ;z-index : 0;"></canvas>';

    // creates a canvas with player id and layer i.
    // layer 0 = background image, last layer = game info
    // creates a token for each player on their canvas.
    for (let i = 1; i <= playerList.length; i += 1) {
        createCanvas(playerList[i - 1], 'content', i);
        playerTokenInformation[String(playerList[i - 1])] = images[tokenSelector];
        // {player1: start 0 and end 0 }
        playerPositions[String(playerList[i - 1])] = {current: 0, end: 0};
        control.movePlayer(playerList[i - 1], 0, playerTokenInformation);
        tokenSelector += 1;
    }
    createCanvas('game-info', 'content', playerList + 1);
    const c = document.getElementById('gameBoard');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
    img.src = 'monopoly.jpg';
}

// takes in id for canvas, node to append to(<div id="content">), layerNumber
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
    // eventSource.addEventListener('gameEnd', disableActiveGameListeners);
}

function startAnimation() {
    timer = setInterval(animate, 500);
}

function animate() {
    playerPositions[currentPlayer].current += 1;
    let nextPosition = playerPositions[currentPlayer].current;
    console.log(nextPosition);
    if (nextPosition > 39) {
        nextPosition -= 40;
        playerPositions[currentPlayer].current = nextPosition;
    }
    control.movePlayer(currentPlayer, nextPosition, playerTokenInformation);
    if (playerPositions[currentPlayer].current === playerPositions[currentPlayer].end) {
        clearInterval(timer);
        console.log('ended');
        currentPlayer = '';
    }
}
/*
function disableActiveGameListeners(gameEndEvent) {
    const eventSource = getEventSource();
    eventSource.removeEventListener('playerMove', onPlayerMove);
    eventSource.removeEventListener('playerTurn', onPlayerTurn);
    eventSource.removeEventListener('playerBalance', onPlayerBalance);
}
*/
