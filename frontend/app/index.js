import * as sendJSON from './sendJSON';


window.onload = () => {
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

window.addEventListener('DOMContentLoaded', startCheckingForTurn, false);

function startCheckingForTurn(event) {
    window.setInterval(checkForTurn, 1000);
}

function checkForTurn() {
    sendJSON.sendJSON({
        jsonObject: {},
        serverAddress: 'cgi-bin/check_turn.py',
        callback: (request) => {
            if (request.readyState === 4 && request.status === 200) {
                const jsonResponse = JSON.parse(request.responseText);
                if (jsonResponse.your_turn === true) {
                    const turnStartEvent = new CustomEvent('turnStart');
                    window.dispatchEvent(turnStartEvent);
                }
            }
        }
    });
}
