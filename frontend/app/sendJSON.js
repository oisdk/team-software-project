// Generate JSON to send to server on game start.
export function generateGameStartJSON() {
    return JSON.stringify({type: 'gameStart'});
}

// Send a POST request to the server for the game start.
export function gameStartRequest(serverAddress, callback) {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = callback;
    ajaxRequest.open('POST', serverAddress, true);
    ajaxRequest.send(generateGameStartJSON());
}
