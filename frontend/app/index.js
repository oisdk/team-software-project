import * as checkUserIDCookie from './checkUserIDCookie';
import * as generateUsernameForm from './generateUsernameForm';
import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';
import * as createUserCookie from './createUserCookie';


window.onload = () => {
    const playerObject = checkUserIDCookie.checkUserDetails();
    // Check if playerObject is not empty.
    // The following expression checks how many fields are in an object,
    // if it's not zero then we show the create/join game page.
    if (Object.getOwnPropertyNames(playerObject).length !== 0) {
        // Generate page for visitor to create or join a game
        generateCreateJoinGamePage.generateCreateJoinGamePage();
    } else {
        // Generate page for visitor to create new username
        generateUsernameForm.generateUsernameForm((req) => {
            if (req.readyState === 4 && req.status === 200) {
                createUserCookie.generateUserCookie(req.responseText);
                generateCreateJoinGamePage.generateCreateJoinGamePage();
            }
        });
    }
};
