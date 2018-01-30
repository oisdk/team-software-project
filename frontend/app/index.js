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
        console.log('opened!');
        eventSource.addEventListener('error', (error) => {
            console.log(`SSE error: ${error.type}`);
        });
        eventSource.addEventListener('message', (message) => {
            console.log(`SSE message: ${message.data}`)
        });
        let turnCounter = 0;
        eventSource.addEventListener('fuck', (message) => {
            console.log(`SSE event of type fuck: ${message.data}`);
            const activeTurn = JSON.parse(message.data).activeTurn;
            const username = document.querySelector('#username').value;
            if (activeTurn == document.querySelector('#username').value && ++turnCounter == 5) {
                console.log('Ending turn');
                turnCounter = 0;
                sendJSON.sendJSON({
                    jsonObject: {},
                    serverAddress: 'cgi-bin/end_turn.py',
                    callback: () => {}
                });
            }
        });
    };

    document.querySelector('#usernameInput').onclick = (click) => {
        click.preventDefault();
        sendJSON.sendJSON({
            jsonObject: {'username': document.querySelector('#username').value},
            serverAddress: 'cgi-bin/create_user_entry.py',
            callback: () => {}
        });
    };
};
