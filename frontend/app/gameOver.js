import {checkUserDetails} from './checkUserIDCookie';
/**
 * Handles user interaction once a game has finished.
 * @module
 */

/**
 * Displays a Game Over screen to the user.
 *
 * @param gameEndEvent The event that signalled the end of the game.
 */
export function gameOver(gameEndEvent) {
    const eventData = JSON.parse(gameEndEvent.data);

    const rootElement = document.getElementById('content');
    while (rootElement.firstChild) {
        rootElement.firstChild.remove();
    }
    rootElement.appendChild(createGameOverHTML(eventData.winner));
}

/**
 * Creates the html for the Game Over page.
 *
 * @param {Object} winner The object containing the winner’s info, which has a "name" field and an
 *     "id" field.
 * @return {HTMLElement} The root element of the newly-created DOM subtree.
 */
function createGameOverHTML(winner) {
    const container = document.createElement('section');

    const header = document.createElement('h1');
    header.textContent = 'Game over!';
    container.appendChild(header);

    const paragraph = document.createElement('p');
    if (winner.id === parseInt(checkUserDetails().user_id, 10)) {
        paragraph.textContent = 'You win!';
    } else {
        paragraph.textContent = `You lose – the winner is ${winner.name}!`;
    }
    container.appendChild(paragraph);

    return container;
}
