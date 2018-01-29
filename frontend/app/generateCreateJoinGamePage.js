// Callback function to update HTML body with file's contents
export function updatePage(fileReader) {
    document.body.innerHTML = fileReader.responseText;
}

// Function to generate create game / join game page
export function generateCreateJoinGamePage() {
    // Generate a HTML page with buttons to load the "create new game" page
    // or "join existing game" page
    const fileReader = new XMLHttpRequest();
    fileReader.open('GET', 'create-join-game.html', true);
    fileReader.onreadystatechange = () => updatePage(fileReader);
}
