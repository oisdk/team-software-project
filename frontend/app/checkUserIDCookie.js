
/**
 * Function to extract a specified cookie value from a browser's cookie header.
 * @param {array} browserCookies - The browser's cookies, one cookie per element.
 * @param {string} cookieNameToFind - The cookie to search for in browserCookies.
 */
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

/**
 * Function to check visitor's cookies for a username/userid.
 * @return {object} A player object containing the visitor's username and id
 * extracted from the cookie.
 */
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
    let userDetails = {};
    if (username !== null && userid !== null) {
        userDetails = {user_name: username, user_id: userid};
    }
    return userDetails;
}
