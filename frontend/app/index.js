import * as sendJSON from './sendJSON';

window.onload = () => {
    document.getElementById('roll_die').onclick = () => {
        sendJSON.gameStartRequest('cgi-bin/request_dice_roll.py', () => {});
    };
};
