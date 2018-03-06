import {waitingGame} from './waitingGame';
import * as getCookie from './checkUserIDCookie';
import * as sendJSON from './sendJSON';

/**
 * Function to let a user join a selected game and be placed in a waiting game lobby.
 *
 * @param gameID - The ID of the game selected to join.
 * @param {string} waitFunction - Takes in a function name to call.
 * @param {string} sendFunction - Takes in a function name to call.
 */
export function sendGameId(gameID, waitFunction, sendfunction) {
    // cast to number for consistency with create game.
    const gameIdValue = parseInt(gameID.value, 10);
    if (gameID !== null) {
        const details = getCookie.checkUserDetails();
        const id = details.user_id;
        sendfunction({
            serverAddress: 'cgi-bin/join_game.py',
            jsonObject: {user_id: id, game_id: gameIdValue},
        });
        waitFunction(gameIdValue);
    }
}

/**
 * Callback function which dynamically generates a HTML table containing the list of games.
 * A radio button is located alongside each game for selection.
 *
 * @param {XMLHttpRequest} xhttp - Contains list of games to display.
 * @private
 */
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

        document.getElementById('tableI').innerHTML = '<td><button type="submit" class="btn- btn-lg btn-outline-danger" id="joinSelectedGame">Join Game</button></td><td></td>';
        document.getElementById('joinSelectedGame').onclick = () => { sendGameId(document.querySelector('input[name="gameID"]:checked'), waitingGame, sendJSON.sendJSON); };
    }
}

/**
 * Function to request and receive a list of games currently active.
 */
export function requestGameList() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => pickGame(xhttp);
    xhttp.open('POST', 'cgi-bin/request_games_list.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
