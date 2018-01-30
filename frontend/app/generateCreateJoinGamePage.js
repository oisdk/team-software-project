import getCookieValue as getCookieValue from './checkUserIDCookie';

// Callback function to update HTML body with file's contents
export function updatePage(fileReader) {
    document.body.innerHTML = fileReader.responseText;
    const usernameField = document.querySelector('#username');
    const username = getCookieValue(document.cookie.split('; '), 'user_name');
    usernameField.innerHTML = username;
}

// Function to generate create game / join game page
export function generateCreateJoinGamePage() {
    // Generate a HTML page with buttons to load the "create new game" page
    // or "join existing game" page
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'create-join-game.html', true);
    fileReader.onreadystatechange = () => updatePage(fileReader);
    fileReader.send();
}
