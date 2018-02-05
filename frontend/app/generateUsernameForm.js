export function requestUserID(serverAddress, nameSubmitted, callback) {
    const name = JSON.stringify({username: nameSubmitted});
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverAddress, true);
    xhttp.onreadystatechange = () => callback(xhttp);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(name);
}

export function generateUsernameForm(callback) {
    document.body.innerHTML = '<form><label for="username">Enter Username</label><input type="text" id="username"><input type="submit" value="Submit" id="submit_username" disabled><span id="checker"></span></form>';
    document.getElementById('submit_username').addEventListener('click', (event) => { event.preventDefault(); });
    document.getElementById('submit_username').onclick = () => requestUserID('cgi-bin/allocate_user_id.py', document.getElementById('username').value, callback);
}
