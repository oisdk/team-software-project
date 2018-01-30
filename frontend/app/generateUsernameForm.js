
export function requestUserID(serverAddress, username, callback) {
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
    s.id.addEventListener('click', (event) => { event.preventDefault(); });
    s.id.onclick = requestUserID('cgi-bin/allocate_user_id.py', document.getElementById('username').value, (req) => {
        if (req.readyState === 4 && req.status === 200) {
            // do whats needed with the value returned

            const pTag = document.createElement('p');
            const t = document.createTextNode(req.responseText);
            pTag.appendChild(t);
            document.body.appendChild(t);
        }
    });
}

