import {getEventSource} from './sse';
// import {generateGameInterface} from './generateGameInterface';
// import {generateUserDetails} from './generateUserDetails';
import * as control from './moveFunctions';

// import {generateGameLog} from './generateGameLog';

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID) {
    // generateGameInterface();
    // generateUserDetails();
    // generateGameLog();
    displayBoard();
    // control.movePlayer('layer2', 15);

    // enableActiveGameListeners();
}

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

/**
 * Called when a playerMove event happens.
 *
 * Dummy implementation for the moment.
 */
function onPlayerMove(playerMoveEvent) {}

/**
 * Called when a playerTurn event happens.
 *
 * Dummy implementation for the moment.
 */
function onPlayerTurn(playerTurnEvent) {}

/**
 * Called when a playerBalance event happens.
 *
 * Dummy implementation for the moment.
 */
function onPlayerBalance(playerBalanceEvent) {}

/**
 * Mock function for displaying the monopoly board onscreen.
 */
 
 // displayBoard should take in player id's and then generate the canvas with its ids.
 // another option instead of using create canvas can be.
 // document.getElementById('content').insertAdjacentHTML
 // ('beforeend', '<canvas id="layer2" width="800" height="800" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>');
function displayBoard() {
    console.log('displayBoard called');
    // need to change id's;
    document.getElementById('content').innerHTML = '<canvas id="gameBoard" height="800" width = "800" style="position: absolute; left: 0 ; top: 0 ;z-index : 0;"></canvas>';
    createCanvas('player1', 'content', 1)
    createCanvas('player2', 'content', 2)
    createCanvas('player3', 'content', 3)
    createCanvas('player4', 'content', 4)
    createCanvas('game-info', 'content', 5)
    const c = document.getElementById('gameBoard');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
    img.src = 'monopoly.jpg';
}

// takes in id for canvas, node to append to(<div id="content">), layerNumber always top ?
function createCanvas(canvasID, appendToNode, layerNumber){
    var canvas = document.createElement('canvas');
    canvas.id = canvasID;
    canvas.height = 800;
    canvas.width = 800;
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.zIndex = layerNumber;
    document.getElementById(appendToNode).append(canvas);
}
