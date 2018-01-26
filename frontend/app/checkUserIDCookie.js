export function checkUserCookie() {
    let browserCookies = document.cookie;
    if (browserCookies !== "") {
        browserCookies = browserCookies.split("; ");
        let username = getUsername(browserCookies);
        let user_id = getUserID(browserCookies);
        if (username !== null && user_id !== null) {
            // Create ajax request for either create username / join-create game
        }
    }
}

export function getUsername(browserCookies) {
    for (i = 0; i < browserCookies.length; i++) {
        let cookie = browserCookies[i];
        let cookieName;
        let j;
        for (j = 0; cookie[j] !== "="; j++) {
            cookieName += cookie[j];
        }
        if (cookieName === "user_name") {
            return cookie.substring(j + 1);
        }
    }
}

export function getUserID(browserCookies) {
    for (i = 0; i < browserCookies.length; i++) {
        let cookie = browserCookies[i];
        let cookieName;
        let j;
        for (j = 0; cookie[j] !== "="; j++) {
            cookieName += cookie[j];
        }
        if (cookieName === "user_id") {
            return cookie.substring(j + 1);
        }
    }
}
