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
}
