import * as checkUserIDCookie from './checkUserIDCookie';
// import * as random from './random';

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

// describe('Start request test suite', () => {
//     const oldXMLHttpRequest = window.XMLHttpRequest;
//
//     const mockXHR = {
//         open: jest.fn(),
//         send: jest.fn(),
//         setRequestHeader: jest.fn(),
//     };
//
//     beforeEach(() => {
//         window.XMLHttpRequest = jest.fn(() => mockXHR);
//     });
//
//     afterEach(() => {
//         window.XMLHttpRequest = oldXMLHttpRequest;
//     });
//
//     test('should', (done) => {
//         const callbackfn = jest.fn();
//         const mockServerAddress = random.string(5);
//         sendJSON.gameStartRequest(mockServerAddress, callbackfn);
//         expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress, true);
//         expect(callbackfn).not.toHaveBeenCalled();
//         mockXHR.onreadystatechange();
//         expect(callbackfn).toHaveBeenCalledWith(mockXHR);
//         expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({type: 'gameStart'}));
//         expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type',
//         'application/json; charset=UTF-8');
//         done();
//     });
// });
