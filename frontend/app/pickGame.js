export function pickGame(xhttp) {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
        document.body.innerHTML = '<table id="table"><tr id="row1"></tr></table>';
        document.getElementById('row1').innerHTML = '<th>Select</th><th>List of games</th>';

        const list = JSON.parse(xhttp.responseText);
        let i;
        for (i in list) {
            const row = document.createElement('TR');
            const data1 = document.createElement('TD');
            const data2 = document.createElement('TD');
            const x = document.createElement('INPUT');
            const t = document.createTextNode(i);

            // set values for radio buttons
            x.setAttribute('type', 'radio');
            x.setAttribute('name', 'gameID');
            x.setAttribute('value', i);

            // add radio button to the row 1st column.
            data1.appendChild(x);
            row.appendChild(data1);

            // add game id to the row 2nd column
            data2.appendChild(t);
            row.appendChild(data2);
            document.getElementById('table').appendChild(row);
        }
        document.getElementById('table').innerHTML += '<tr><td><input type="submit" value="Join game" id="joinSelectedGame"> </td></tr>';
        document.getElementById('joinSelectedGame').addEventListener('click', () => {
            if (document.querySelector('input[name="gameID"]:checked') != null) {
                const gameID = document.querySelector('input[name="gameID"]:checked').value;
                // call waiting game function with item gameID as parameter.
            }
        });
    }
}

export function requestGameList() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => pickGame(xhttp);
    xhttp.open('POST', 'get_games.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
