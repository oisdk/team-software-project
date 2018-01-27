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

describe('checkUserDetails with mocked cookies', () => {
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeAll(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
        document.cookie = 'user_name=testname';
        document.cookie = 'user_id=testid';
    });

    test('should successfully retrieve cookies and make ajax request', (done) => {
        expect(checkUserIDCookie.checkUserDetails()).toBe(true);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'cgi-bin/instantiate-player.py', true);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({user_name: 'testname', user_id: 'testid'}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json; charset=UTF-8');
        done();
    });
});

describe('checkUserDetails without cookies', () => {
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeAll(() => {
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    test('should not retrieve cookies and return false', () => {
        expect(checkUserIDCookie.checkUserDetails()).toBe(false);
    });
});
