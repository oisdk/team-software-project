// returns true if the username textbox contains no value, otherwise false
export function checkTextField(username) {
    const usernameValue = username.value;
    if (usernameValue !== null && usernameValue.trim() !== '') {
        return false;
    } else if (usernameValue === null || usernameValue.trim() === '') {
        return true;
    }

    return true;
}

// disables username textbox and enables roll_die button if username contains a value,
// otherwise does the opposite
export function boxChecked() {
    const username = document.querySelector('#username');
    const confirmUsername = document.querySelector('#confirm_username');
    const checker = document.querySelector('#checker');
    if (confirmUsername.checked) {
        if (!checkTextField(username)) {
            username.disabled = true;
            confirmUsername.disabled = true;
            document.getElementById('roll_die').disabled = false;
            checker.innerHTML = 'Username is confirmed';
        } else {
            checker.innerHTML = 'Username hasn\'t been entered';
        }
    }
}

