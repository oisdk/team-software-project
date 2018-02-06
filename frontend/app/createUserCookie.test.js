import * as createCookie from './createUserCookie';
import * as checkUserIDCookie from './checkUserIDCookie';

const testUserObject = JSON.stringify({your_username: 'testusername', your_id: '12345'});
const testCookie = {user_name: 'testusername', user_id: '12345'};
let userCookie;

describe('createUserCookie', () => {
    // Setup function to insert mocks into cookies
    beforeAll(() => {
    // Call function to create user cookie
    // Read user cookie for testing
        createCookie.generateUserCookie(testUserObject);
        userCookie = checkUserIDCookie.checkUserDetails();
    });

    // Teardown function to delete cookies
    afterAll(() => {
    // Set an old expiry date on the cookies so they are deleted
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should be \'{your_username: \'testusername\', your_id: \'12345\'}\'', () => {
        expect(testCookie).toEqual(userCookie);
    });
});
