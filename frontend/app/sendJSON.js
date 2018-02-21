export const noOp = (_) => {};

/**
 * Sends some json to a specific server address, and executes a success or
 * failure callback when a response is received.
 *
 * @param {String} serverAddress The address to send the request to.
 * @param {Object} jsonObject The JSON to send as the body of the request.
 * @param {function} successCallback If the request receives a success response, this
 *        will be called with the request as its only parameter.
 * @param {function} failureCallback If the request receives a failure response, this
 *        will be called with the request as its only parameter.
 */
export function sendJSON({
    serverAddress,
    jsonObject = {},
    successCallback = noOp,
    failureCallback = noOp,
}) {
    const request = new XMLHttpRequest();
    request.open('POST', serverAddress);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                successCallback(request);
            } else {
                failureCallback(request);
            }
        }
    };
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(jsonObject));
}
