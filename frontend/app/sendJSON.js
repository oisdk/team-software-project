// Generate JSON to send to server on game start.
export function generateGameStartJSON() {
    return JSON.stringify({type: 'gameStart'});
}

// Send a POST request to the server for the game start.
export function gameStartRequest(serverAddress, callback) {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('POST', serverAddress, true);
    ajaxRequest.onreadystatechange = () => callback(ajaxRequest);
    ajaxRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    ajaxRequest.send(generateGameStartJSON());
}

/**
 * Sends some json to a specific server address, and executes a success or
 * failure callback when a response is received.
 *
 * @param serverAddress {String} The address to send the request to.
 * @param jsonObject {Object} The JSON to send as the body of the request.
 * @param successCallback If the request receives a success response, this
 *        will be called with the request as its only parameter.
 * @param failureCallback If the request receives a failure response, this
 *        will be called with the request as its only parameter.
 */
export function sendJSON({
    serverAddress,
    jsonObject = {},
    successCallback = _ => {},
    failureCallback = _ => {},
}) {
    const request = new XMLHttpRequest();
    request.open('POST', serverAddress);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.state === 200) {
                successCallback(request);
            } else {
                failureCallback(request);
            }
        }
    };
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(jsonObject));
}
