import * as sendJSON from './sendJSON';

window.onload = () => {
    document.getElementById('roll_die').onclick = () => {
        sendJSON.gameStartRequest('cgi-bin/request_dice_roll.py', (req) => {
            if (req.readyState === 4 && req.status === 200) {
                document.body.innerHTML += req.responseText;
            }
        });
    };
};
