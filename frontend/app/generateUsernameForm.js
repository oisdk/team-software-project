
export function requestUserID(serverAddress, username, callback) {
    const name = JSON.stringify({user: username});
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverAddress, true);
    xhttp.onreadystatechange = () => callback(xhttp);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(name);
}

export function generateUsernameForm() {
    document.body.innerHTML = '<form>Enter Username<input type="text" id="username"><input type="submit" value="Submit" id="submit_username"></form>';
    document.getElementById('submit_username').addEventListener('click', (event) => { event.preventDefault(); });
    document.getElementById('submit_username').onclick = requestUserID('', document.getElementById('username').value, (req) => {
        if (req.readyState === 4 && req.status === 200) {
            // do whats needed with the value returned
        }
    });
}

