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

describe('getCookieValue invalid input test', () => {
    it('should be \'null\'', () => {
        expect(checkUserIDCookie.getCookieValue(testCookieHeader, 'xyz')).toBeNull();
    });
});

describe('checkUserDetails with cookies', () => {
    const oldxhr = window.XMLHttpRequest;

    // Create a mock XMLHttpRequest
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Setup function to hijack XMLHttpRequest and insert mocks into cookies
    beforeAll(() => {
        // Any request made to XMLHttpRequest are redirected to the mock object
        // above
        window.XMLHttpRequest = jest.fn(() => mockXHR);

        document.cookie = 'user_name=testname';
        document.cookie = 'user_id=testid';
    });

    // Teardown function to restore window XMLHttpRequest and delete cookies
    afterAll(() => {
        // Any request made to XMLHttpRequest are redirected to the mock object
        // above
        window.XMLHttpRequest = oldxhr;

        // Set an old expiry date on the cookies so they are deleted
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    test('should make AJAX request since cookies present', (done) => {
        checkUserIDCookie.checkUserDetails();
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'cgi-bin/instantiate-player.py', true);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({user_name: 'testname', user_id: 'testid'}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json; charset=UTF-8');
        done();
    });
});

describe('checkUserDetails without cookies', () => {
    test('should not retrieve cookies and return null', () => {
        expect(checkUserIDCookie.checkUserDetails()).toBeNull();
    });
});


describe('retrievePlayerObject with successful AJAX response', () => {
    // Create a mock XMLHttpRequest
    const mockXHR = {
        readyState: 4,
        status: 200,
        ResponseText: '{"mockPlayerObject": "mockData"}',
    };

    test('should make ajax request since cookies present', (done) => {
        checkUserIDCookie.receivePlayerObject(mockXHR);
        done();
    });
});

describe('retrievePlayerObject with unsuccessful AJAX response', () => {
    // Create a mock XMLHttpRequest
    const mockXHR = {
        readyState: 4,
        status: 404,
    };

    test('should make ajax request since cookies present', (done) => {
        checkUserIDCookie.receivePlayerObject(mockXHR);
        done();
    });
});
