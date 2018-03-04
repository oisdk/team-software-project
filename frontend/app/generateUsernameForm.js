
/**
 * Function to request and receive a user id associated with a username.
 *
 * @param {string} serverAddress - Address of program to request id.
 * @param {string} nameSubmitted - username entered by user.
 * @param callback - success or failure callback if a response is received.
 * @private
 */

export function requestUserID(serverAddress, nameSubmitted, callback) {
    const name = JSON.stringify({username: nameSubmitted});
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverAddress, true);
    xhttp.onreadystatechange = () => callback(xhttp);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(name);
}

/**
 * Function to dynamically generate a username form, its submit button
 * calls requestUserID to get an id.
 *
 * @param callback - success or failure callback if a response is received.
 */
export function generateUsernameForm(callback) {
    document.getElementById('content').innerHTML = '<form class="center"><div class="form-group"><label for="username"></label><input class="form-control center" type="text" id="username" placeholder="Enter Username"></div><button type="submit" class="btn btn-outline-danger btn-block" id="submit_username" disabled>Submit</button><span id="checker"></span></form>';
    document.getElementById('submit_username').addEventListener('click', (event) => { event.preventDefault(); });
    document.getElementById('submit_username').onclick = () => requestUserID('cgi-bin/allocate_user_id.py', document.getElementById('username').value, callback);
}
