
export function requestUserID(serverAddress, username, callback) {
    const name = JSON.stringify({user: username});
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverAddress, true);
    xhttp.onreadystatechange = () => callback(xhttp);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(name);
}

export function generateUsernameForm(callback) {
    document.body.innerHTML = '<form><label for="username">Enter username:</label><input type="text" id="username"><br><input type="checkbox" name="confirm_username" id="confirm_username"><span id="checker">I have confirmed my username</span><br><input type="submit" value="Submit" id="submit_username" disabled></form>';
    document.getElementById('submit_username').addEventListener('click', (event) => { event.preventDefault(); });
    document.getElementById('submit_username').onclick = () => requestUserID('', document.getElementById('username').value, callback);
}
