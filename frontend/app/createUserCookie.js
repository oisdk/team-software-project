export default './createUserCookie';

/**
 * Function to generate user cookie.
 * Parses userObject from JSON.
 * Create cookie for each field in user object.
 * @param {userObject} userObject -  JSON object containing user details.
 */
export function generateUserCookie(userObject) {
    // Parse userObject from JSON
    const user = JSON.parse(userObject);
    // Create cookie for each field
    document.cookie = (`user_name = ${user.your_username}`);
    document.cookie = (`user_id =   ${user.your_id}`);
}

