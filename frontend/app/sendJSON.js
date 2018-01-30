// Generate JSON to send to server on game start.
export function generateGameStartJSON() {
    return {type: 'gameStart'};
}

// Send a POST request to the server for the game start.
export function gameStartRequest(serverAddress, callback) {
    sendJSON({
        'jsonObject': generateGameStartJSON(),
        'serverAddress': serverAddress,
        'callback': callback
    });
}

/**
 * Sends a JSON ajax request.
 *
 * @param {Object} jsonObject The object to stringify and send as JSON.
 * @param {String} serverAddress The address to the send the request to.
 * @param {Function} callback The callback that will be called when the ajax
 *        request’s readystate changes.
 */
export function sendJSON({jsonObject, serverAddress, callback}) {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('POST', serverAddress, true);
    ajaxRequest.onreadystatechange = () => callback(ajaxRequest);
    ajaxRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    ajaxRequest.send(JSON.stringify(jsonObject));
}
