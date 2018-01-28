export function checkTextField() {
    const usernameValue = document.querySelector('#username').value;
    if (usernameValue !== null && usernameValue.trim() !== '') {
        return false;
    } else if (usernameValue === null || usernameValue.trim() === '') {
        return true;
    }

    return true;
}

export function boxChecked() {
    const username = document.querySelector('#username');
    const confirmUsername = document.querySelector('#confirm_username');
    const checker = document.querySelector('#checker');
    if (confirmUsername.checked) {
        if (!checkTextField()) {
            username.disabled = true;
            confirmUsername.disabled = true;
            document.getElementById('roll_die').disabled = false;
            checker.innerHTML = 'Username is confirmed';
        } else {
            checker.innerHTML = 'Username hasn\'t been entered';
        }
    }
}
