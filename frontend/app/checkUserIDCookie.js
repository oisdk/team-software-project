// Variable to which a player object is conditionally assigned
let playerObject = null;

// Function to extract a specified cookie value from a browser's cookie header
export function getCookieValue(browserCookies, cookieNameToFind) {
    // Iterate over the array of browser cookies
    for (let i = 0; i < browserCookies.length; i += 1) {
        // Extract a single cookie from the array of cookies
        const cookie = browserCookies[i];
        // Check if the selected cookie is what we are looking for
        const cookieNameIndex = cookie.indexOf(cookieNameToFind);
        if (cookieNameIndex !== -1) {
            // Return the value of the cookie
            return cookie.substring(cookieNameToFind.length + 1);
        }
    }
    return null;
}

// Callback function for server responding with player object
export function receivePlayerObject(ajaxRequest) {
    if (ajaxRequest.readyState === 4 && ajaxRequest.status === 200) {
        playerObject = JSON.parse(ajaxRequest.responseText);
    }
}

// Function to check visitor's cookies for a username/userid and return a
// player object if the visitor has been recorded before
export function checkUserDetails() {
    // Declare variables to hold corresponding cookie values
    let username = null;
    let userid = null;
    // Get the browser's cookies for the current page
    let browserCookies = document.cookie;
    // Check if the browser has any cookies
    if (browserCookies !== '') {
        // Extract the user_name and user_id cookies
        browserCookies = browserCookies.split('; ');
        username = getCookieValue(browserCookies, 'user_name');
        userid = getCookieValue(browserCookies, 'user_id');
    }
    // Check if the user_name and user_id cookies were successfully extracted
    if (username !== null || userid !== null) {
        // Create a JavaScript object to store the user's login details
        const userDetails = {user_name: username, user_id: userid};
        // Request the server to create an instance of a player class
        const ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange = () => receivePlayerObject(ajaxRequest);
        ajaxRequest.open('POST', 'cgi-bin/instantiate-player.py', true);
        ajaxRequest.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        ajaxRequest.send(JSON.stringify(userDetails));
    }
    return playerObject;
}
