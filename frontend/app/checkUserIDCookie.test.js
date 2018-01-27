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

describe('checkUserDetails test suite', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;
    const browserCookies = document.cookie;

    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
        document.cookie = 'user_name=testname';
        document.cookie = 'user_id=testid';
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
        document.cookie = browserCookies;
    });

    test('should retrieve cookies and make ajax request', (done) => {
        expect(checkUserIDCookie.checkUserDetails()).toBe(true);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'cgi-bin/instantiate-player.py', true);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({user_name: 'testname', user_id: 'testid'}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json; charset=UTF-8');
        done();
    });
});
