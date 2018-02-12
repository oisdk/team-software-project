// Enables the roll button for the player if the previous
// roll values are equal
export function checkRollValuesEqual(){...}

// Adds event listener to the roll button for the player to
// enable/disable the button
export function validateRollButton() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => checkRollValuesEqual(xhttp);
    xhttp.open('POST', 'cgi-bin/...', true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhttp.send();
}
