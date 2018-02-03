import * as checkUserIDCookie from './checkUserIDCookie';

const testCookieHeader = ['cookie1=testvalue', 'cookie2=othervalue'];

describe('getCookieValue valid input test 1', () => {
    it('should be \'testvalue\'', () => {
        expect(checkUserIDCookie.getCookieValue(testCookieHeader, 'cookie1')).toEqual('testvalue');
    });
});

describe('getCookieValue valid input test 2', () => {
    it('should be \'othervalue\'', () => {
        expect(checkUserIDCookie.getCookieValue(testCookieHeader, 'cookie2')).toEqual('othervalue');
    });
});

describe('getCookieValue invalid input test 3', () => {
    it('should be \'null\'', () => {
        expect(checkUserIDCookie.getCookieValue(testCookieHeader, 'xyz')).toBeNull();
    });
});

describe('checkUserDetails with cookies', () => {
    // Setup function to hijack XMLHttpRequest and insert mocks into cookies
    beforeAll(() => {
        document.cookie = 'user_name=testname';
        document.cookie = 'user_id=testid';
    });

    // Teardown function to restore window XMLHttpRequest and delete cookies
    afterAll(() => {
        // Set an old expiry date on the cookies so they are deleted
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    test('should retrieve cookies and return object representing player', (done) => {
        expect(checkUserIDCookie.checkUserDetails()).toEqual({user_name: 'testname', user_id: 'testid'});

        done();
    });
});

describe('checkUserDetails without cookies', () => {
    test('should not retrieve cookies and return null', () => {
        expect(checkUserIDCookie.checkUserDetails()).toEqual({});
    });
});
