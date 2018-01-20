// Generate stringified JSON object from JavaScript object
export function generateJSON() {
    const data = { type: 'gameStart' };
    const stringifiedData = JSON.stringify(data);
    return stringifiedData;
}

// Send stringified JSON data to a server through an AJAX request
export function sendJSONToServer(dataToSend = null) {
    let stringifiedData;
    if (dataToSend === null) {
        stringifiedData = JSON.stringify({ type: 'gameStart' });
    } else {
        stringifiedData = JSON.stringify(dataToSend);
    }

    const ajaxRequest = new XMLHttpRequest();
    // ajaxRequest.onreadystatechange = function receiveResponse() {
    //     if (this.readyState === 4 && this.status === 200) {
    //         // Take action based on server response
    //     }
    // };
    // ajaxRequest.open('GET', '../../backend/backend/example.py', true);
    return [ajaxRequest.readyState, stringifiedData];
}
