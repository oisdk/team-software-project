// Import function to generate create/join page.
// import generateCreateJoinPage as generateCreateJoinPage from './generateCreateJoinPage';
export default './createUserCookie';
// Function to generate user cookie
export function generateUserCookie(userObject) {
    const user = JSON.parse(userObject);
    document.cookie = (`user_name = ${user.your_username}`);
    document.cookie = (`user_id =   ${user.your_id}`);
    return userObject;
}

