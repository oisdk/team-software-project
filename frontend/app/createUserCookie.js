// import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';

export default './createUserCookie';

// Function to generate user cookie
export function generateUserCookie(userObject) {
    // Parse userObject from JSON
    const user = JSON.parse(userObject);
    // Create cookie for each field
    document.cookie = (`user_name = ${user.your_username}`);
    document.cookie = (`user_id =   ${user.your_id}`);
    // Call fucntion generate createjoin page
    // generateCreateJoinGamePage.generateCreateJoinGamePage();
}

