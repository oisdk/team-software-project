export function checkUserCookie() {
    let browserCookies = document.cookie;
    if (browserCookies !== "") {
        browserCookies = browserCookies.split("; ");
        let username = getUsernameCookie();
        let user_id = getUserIDCookie();
        if (username !== null && user_id !== null) {
            // Create ajax request for either create username / join-create game
        }
    }
}
