// Generate stringified JSON from a JavaScript object
export function generateJSON(dataToStringify) {
    let JSONData;
    if (dataToStringify === null) {
        JSONData = JSON.stringify({ type: 'gameStart' });
    } else {
        JSONData = JSON.stringify(dataToStringify);
    }
    return JSONData;
}

// Send stringified JSON data to a server through an AJAX request
export function sendJSONToServer(dataToSend) {
    const JSONData = generateJSON(dataToSend);

    const ajaxRequest = new XMLHttpRequest();
    // ajaxRequest.onreadystatechange = function receiveResponse() {
    //     if (this.readyState === 4 && this.status === 200) {
    //         // Take action based on server response
    //     }
    // };
    // ajaxRequest.open('GET', '../../backend/backend/example.py', true);
    return [ajaxRequest.readyState, JSONData];
}
