// import {getEventSource} from './sse';
// import {generateGameInterface} from './generateGameInterface';
// import {generateUserDetails} from './generateUserDetails';
import * as control from './moveFunctions';

// import {generateGameLog} from './generateGameLog';

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID, playerList) {
    console.log(gameID);
    // generateGameInterface();
    // generateUserDetails();
    // generateGameLog();

    // display board and assign starting positions.
    displayBoard(playerList);
    control.movePlayer(1, 0);
    control.movePlayer(2, 10);
    control.movePlayer(3, 20);
    control.movePlayer(4, 30);

    // enableActiveGameListeners();
}

/**
function enableActiveGameListeners() {
    const eventSource = getEventSource();
    eventSource.addEventListener('playerMove', onPlayerMove);
    eventSource.addEventListener('playerTurn', onPlayerTurn);
    eventSource.addEventListener('playerBalance', onPlayerBalance);
    eventSource.addEventListener('gameEnd', disableActiveGameListeners);
}

function disableActiveGameListeners(gameEndEvent) {
    const eventSource = getEventSource();
    eventSource.removeEventListener('playerMove', onPlayerMove);
    eventSource.removeEventListener('playerTurn', onPlayerTurn);
    eventSource.removeEventListener('playerBalance', onPlayerBalance);
}
*/

/**
 * Called when a playerMove event happens.
 *
 * Dummy implementation for the moment.
 */
// function onPlayerMove(playerMoveEvent) {}

/**
 * Called when a playerTurn event happens.
 *
 * Dummy implementation for the moment.
 */
// function onPlayerTurn(playerTurnEvent) {}

/**
 * Called when a playerBalance event happens.
 *
 * Dummy implementation for the moment.
 */
// function onPlayerBalance(playerBalanceEvent) {}

/**
 * Mock function for displaying the monopoly board onscreen.
 */

// displayBoard should take in player id's and then generate the canvas with its ids.
// another option instead of using create canvas can be.
// document.getElementById('content').insertAdjacentHTML ('beforeend',
// '<canvas id="" width="" height="" style=""></canvas>');
function displayBoard(playerList) {
    console.log('displayBoard called');
    // need to change id's;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="position: absolute; left: 0 ; top: 0 ;z-index : 0;"></canvas>';

    for (let i = 1; i <= playerList.length; i += 1) {
        createCanvas(i, 'content', i);
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

// takes in id for canvas, node to append to(<div id="content">), layerNumber always top ?
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
