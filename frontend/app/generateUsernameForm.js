
export function requestUserID(serverAddress, callback, username) {
    const name = JSON.stringfy({user: username});
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', serverAddress, true);
    xhttp.onreadystatechange = () => callback(xhttp);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send(name);
}

export function generateUsernameForm() {
    const f = document.createElement('form');
    const e = document.createTextNode('Enter Username ');
    const i = document.createElement('input');
    i.type = 'text';
    i.id = 'username';


    const s = document.createElement('input');
    s.type = 'submit';
    s.value = 'Submit';
    s.id = 'submit_username';

    const p = document.createElement('p');

    f.appendChild(e);
    f.appendChild(i);
    f.appendChild(s);
    f.appendChild(p);

    document.body.appendChild(f);
    document.getElementById('submit_username').addEventListener('click', (event) => { event.preventDefault(); });
    document.getElementById('submit_username').onclick = requestUserID('', '', document.getElementById('username').value);
    // document.getElementById('username').value;
}

