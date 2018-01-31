// Import function which can read cookie values from browser cookie arrays
// import getCookieValue as getCookieValue from './checkUserIDCookie';

// Callback function to update HTML body with file's contents
export function updatePage(fileReader) {
    document.body.innerHTML = fileReader.responseText;
    // Get the username italic field in the page's heading
    // The next lines are to be un-commented once this branch is merged with
    // master along with checkUserIDCookie.js
    /*
    const usernameField = document.querySelector('#username');
    const username = getCookieValue(document.cookie.split('; '), 'user_name');
    // Update the username field to include the player's username
    usernameField.innerHTML = username;
    */
    const joinGameButton = document.getElementById('join-game');
    joinGameButton.addEventListener('click', /* pickGame */ null, false);
}

// Function to generate create game / join game page
export function generateCreateJoinGamePage() {
    // Generate a HTML page with buttons to load the "create new game" page
    // or "join existing game" page
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', '../html/create-join-game.html', true);
    fileReader.onreadystatechange = () => updatePage(fileReader);
    fileReader.send();
}
