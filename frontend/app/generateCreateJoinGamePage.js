// Import function which can read cookie values from browser cookie arrays
import * as checkUserIDCookie from './checkUserIDCookie';

// Callback function to update HTML body with file's contents
export function updatePage(fileReader) {
    if (fileReader.status === 200 && fileReader.readyState === 4) {
        document.body.innerHTML = fileReader.responseText;
        const username = checkUserIDCookie.getCookieValue(document.cookie.split('; '), 'user_name');
        // Get the username (displayed in italics) field in the page's heading
        const usernameField = document.querySelector('#username');
        // Update the username field to include the player's username
        usernameField.innerHTML = username;
    }
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
