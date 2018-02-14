import waitingGame from './pages';
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';

export function sendGameId(gameID, waitFunction, sendfunction) {
    if (gameID !== null) {
        const details = getCookie.checkUserDetails();
        const id = details.user_id;
        sendfunction({
            serverAddress: 'cgi-bin/join_game.py',
            jsonObject: {user_id: id, game_id: gameID.value},
        });
        waitFunction(gameID.value);
    }
}

export function pickGame(xhttp) {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        document.getElementById('content').innerHTML = '<table id="table"><tr id="row1"></tr></table>';

        document.getElementById('row1').innerHTML = '<th>Select</th><th>List of games</th>';

        const list = JSON.parse(xhttp.responseText);
        for (let i = 0; i < Object.keys(list).length; i += 1) {
            const row = document.createElement('TR');
            const data1 = document.createElement('TD');
            const data2 = document.createElement('TD');
            const x = document.createElement('INPUT');
            const t = document.createTextNode(Object.keys(list)[i]);

            // set values for radio buttons
            x.setAttribute('type', 'radio');
            x.setAttribute('name', 'gameID');
            x.setAttribute('value', Object.keys(list)[i]);

            // add radio button to the row, 1st column.
            data1.appendChild(x);
            row.appendChild(data1);

            // add game id to the row, 2nd column
            data2.appendChild(t);
            row.appendChild(data2);
            document.getElementById('table').appendChild(row);
        }
        const newRow = document.createElement('TR');
        newRow.setAttribute('id', 'tableI');

        document.getElementById('table').appendChild(newRow);

        document.getElementById('tableI').innerHTML = '<td><input type="submit" value="Join game" id="joinSelectedGame"></td><td></td>';
        document.getElementById('joinSelectedGame').onclick = () => { sendGameId(document.querySelector('input[name="gameID"]:checked'), waitingGame, sendJSON.sendJSON); };
    }
}

export function requestGameList() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => pickGame(xhttp);
    xhttp.open('POST', 'cgi-bin/request_games_list.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
