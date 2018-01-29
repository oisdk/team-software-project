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

    let eventSource = new EventSource('cgi-bin/notify_turn.py');
    eventSource.onopen = () => {
        eventSource.addEventListener('error', (error) => {
            console.log(`SSE error: ${error.type}`);
        });
        eventSource.addEventListener('message', (message) => {
            console.log(`SSE message: ${message.data}`)
        });
    };
};
