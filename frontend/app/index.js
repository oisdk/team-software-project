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

    // The event source receives notifications from the server
    let eventSource = new EventSource('cgi-bin/notify_turn.py');

    // Once the event source has opened successfully:
    eventSource.onopen = () => {
        console.log('opened!');

        // Add a listener to log errors
        eventSource.addEventListener('error', (error) => {
            console.log(`SSE error: ${error.type}`);
        });

        // Add a listener to log messages
        eventSource.addEventListener('message', (message) => {
            console.log(`SSE message: ${message.data}`)
        });

        let turnCounter = 0;
        // Add a listener to handle turn notifications
        eventSource.addEventListener('turn', (message) => {
            console.log(`SSE event of type turn: ${message.data}`);
            const activeTurn = JSON.parse(message.data).activeTurn;
            const username = document.querySelector('#username').value;
            // End the turn if it’s yours and you’ve been notified 5 times
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

    // Add user to the turn order when they submit their username
    document.querySelector('#usernameInput').onclick = (click) => {
        click.preventDefault();
        sendJSON.sendJSON({
            jsonObject: {'username': document.querySelector('#username').value},
            serverAddress: 'cgi-bin/create_user_entry.py',
            callback: () => {}
        });
    };
};
