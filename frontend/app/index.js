import * as sendJSON from './sendJSON';
import * as checkUserIDCookie fromm './checkUserIDCookie';
import * as generateUsernameForm from './generateUsernameForm';


window.onload = () => {
    const playerObject = checkUserIDCookie.checkUserDetails();
    if (playerObject !== null) {
        // Generate page for visitor to create new username
        generateUsernameForm.generateUsernameForm();
    } else {
        // Generate page for visitor to create/join game
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
