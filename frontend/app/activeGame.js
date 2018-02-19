import {generateGameInterface} from './generateGameInterface';
import {generateUserDetails} from './generateUserDetails';
import {generateGameLog} from './generateGameLog';

/**
 * Displays the page for an active game.
 *
 * @param gameID The ID for the game that will be displayed.
 */
export function activeGame(gameID) {
    generateGameInterface();
    generateUserDetails();
    generateGameLog();
    displayBoard();
}

/**
 * Mock function for displaying the monopoly board onscreen.
 */
function displayBoard() {}
    console.log(`displayBoard called`);
    document.getElementById('content').innerHTML = '<canvas id="myCanvas" width="450" height="450" style="border:1px solid #000000;">';
    const c = document.getElementById('myCanvas');
    const ctx = c.getContext('2d');
    const img = new Image();
    img.src = 'monopoly.jpeg';
    ctx.drawImage(img, 0, 0);
}
