// Display an error message if username is invalid or empty, otherwise show
// a confirmation message and enable the submit button
export function checkTextField() {
    const username = document.querySelector('#username');
    const usernameValue = username.value;
    // Select the span element in which a confirmation message is displayed
    const checker = document.querySelector('#checker');
    // Check if username has typed a valid username
    if (usernameValue !== null && usernameValue.trim() !== '') {
        username.disabled = true;
        document.getElementById('submit_username').disabled = false;
        checker.innerHTML = 'Username is confirmed';
    } else {
        checker.innerHTML = 'Username hasn\'t been entered';
    }
}

// Adds an event listener to the username text field in the new user html page
// which is called when the user clicks outside the text field
export function validateUsername(callback = checkTextField) {
    const username = document.querySelector('#username');
    username.addEventListener('change', callback, false);
}
