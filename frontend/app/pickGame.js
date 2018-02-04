export function pickGame(req) {
    // change call back name when task 2.1 is done.
    // for now an example of what can be expected through this.response ...etc
    let list = JSON.stringify(['game1', 'game2', 'game3', 'game4']);

    if (req.readyState === 4 && req.status === 200) {
        // generate the nodes vs changing innerHTML of an empty div ?
        const ul = document.createElement('ul');
        list = JSON.parse(list);
        var i;
        for (i in list) {
            const li = document.createElement('li');
            const item = document.createTextNode(list[i]);
            li.appendChild(item);
            ul.appendChild(li);
            document.body.appendChild(ul);
        }
    }
}

export function requestGameList() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => pickGame(xhttp);
    xhttp.open('POST', 'get_games.py', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
