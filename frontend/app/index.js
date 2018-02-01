// import * as sendJSON from './sendJSON';
import * as checkUserIDCookie from './checkUserIDCookie';
// import * as generateUsernameForm from './generateUsernameForm';
import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';
// import * as createUserCookie from './createUserCookie';


window.onload = () => {
    const playerObject = checkUserIDCookie.checkUserDetails();
    // Check if playerObject is not empty. The following expression checks how
    // many fields are in an object, if it's not zero then we show the
    // create/join game page
    if (Object.getOwnPropertyNames(playerObject).length !== 0) {
        // Generate page for visitor to create/join game
        generateCreateJoinGamePage.generateCreateJoinGamePage();
    } else {
        // Generate page for visitor to create new username
        // generateUsernameForm.generateUsernameForm((req) => {
        //     if (req.readyState === 4 && req.status === 200) {
        //         createUserCookie.generateUserCookie(req.responseText);
        //     }
        // });
    }
    // document.getElementById('roll_die').onclick = () => {
    //     sendJSON.gameStartRequest('cgi-bin/request_dice_roll.py', (req) => {
    //         if (req.readyState === 4 && req.status === 200) {
    //             const p = document.createElement('P');
    //             const t = document.createTextNode(req.responseText);
    //             p.appendChild(t);
    //             document.body.appendChild(t);
    //         }
    //     });
    // };
};
