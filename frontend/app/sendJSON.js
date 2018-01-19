// Generate stringified JSON object from JavaScript object
export function generateJSON() {
    const data = { type: 'gameStart' };
    const stringifiedData = JSON.stringify(data);
    return stringifiedData;
}

// Send stringified JSON data to a server through an AJAX request
export function sendJSONToServer() {
    const stringifiedData = generateJSON();

    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function receiveResponse() {
        if (this.readyState === 4 && this.status === 200) {
            // Take action based on server response
        }
    };
    ajaxRequest.open('POST', '../../backend/backend/example.py', true);
    ajaxRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajaxRequest.send(`x=|${stringifiedData}`);
    return false;
}
