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
    const eventData = JSON.parse(gameEndEvent);
    console.log('Game over!');
    console.log(`The winner was ${eventData.winner.name}!`);
}
