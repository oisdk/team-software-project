export function checkUserCookie() {
    let browserCookies = document.cookie;
    if (browserCookies !== "") {
        browserCookies = browserCookies.split("; ");
        let user_name = getCookieValue(browserCookies, "user_name");
        let user_id = getCookieValue(browserCookies, "user_id");
        if (user_name !== null && user_id !== null) {
            // Create ajax request for either create username / join-create game
        }
    }
}

export function getCookieValue(browserCookies, cookieNameToFind) {
    for (i = 0; i < browserCookies.length; i++) {
        let cookie = browserCookies[i];
        // console.log(cookie.indexOf("user_id") + " " + cookie);
        let cookieNameIndex = cookie.indexOf(cookieNameToFind);
        if (cookieNameIndex !== -1) {
            return cookie.substring(cookieNameToFind.length + 1);
        }
    }
    return null;
}
