import * as sendJSON from './sendJSON';
import * as checkButton from './checkButton';
// import * as checkUserIDCookie from './checkUserIDCookie';
// import * as generateUsernameForm from './generateUsernameForm';
import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';


window.onload = () => {
    const confirmUsername = document.querySelector('#confirmUsername');
    confirmUsername.addEventListener('click', checkButton.boxChecked, false);
    const playerObject = /* checkUserIDCookie.checkUserDetails(); */ null;
    if (playerObject !== null) {
        // Generate page for visitor to create new username
        // generateUsernameForm.generateUsernameForm();
    } else {
        // Generate page for visitor to create/join game
        generateCreateJoinGamePage.generateCreateJoinGamePage();
    }
    document.getElementById('roll_die').onclick = () => {
        sendJSON.gameStartRequest('cgi-bin/request_dice_roll.py', (req) => {
            if (req.readyState === 4 && req.status === 200) {
                const p = document.createElement('P');
                const t = document.createTextNode(req.responseText);
                p.appendChild(t);
                document.body.appendChild(t);
            }
        });
    };
};
