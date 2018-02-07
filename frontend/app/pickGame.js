import waitingGame from './pages';

export function sendGameId(gameID) {
    if (gameID !== null) {
        waitingGame(gameID.value);
    }
}

export function pickGame(xhttp) {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        document.body.innerHTML = '<table id="table"><tr id="row1"></tr></table>';
        // just testing/ learning. Could put all on one line
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

            // add radio button to the row 1st column.
            data1.appendChild(x);
            row.appendChild(data1);

            // add game id to the row 2nd column
            data2.appendChild(t);
            row.appendChild(data2);
            document.getElementById('table').appendChild(row);
        }
        const test = document.createElement('TR');
        test.setAttribute('id', 'tableI');

        document.getElementById('table').appendChild(test);

        document.getElementById('tableI').innerHTML = '<td><input type="submit" value="Join game" id="joinSelectedGame"></td><td></td>';
        document.getElementById('joinSelectedGame').addEventListener('click', () => {
            sendGameId(document.querySelector('input[name="gameID"]:checked'));
        });
    }
}

export function requestGameList() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => pickGame(xhttp);
    xhttp.open('POST', 'cgi-bin/request_games_list.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
