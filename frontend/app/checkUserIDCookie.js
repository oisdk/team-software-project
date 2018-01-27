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
        ajaxRequest.open('POST', 'cgi-bin/instantiate-player.py', true);
        ajaxRequest.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        ajaxRequest.send(JSON.stringify(userDetails));

        // Users exists and a player object has been created for them
        return true;
    }
    // This user is visiting for the first time
    return false;
}
