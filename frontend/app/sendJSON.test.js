import * as sendJSON from './sendJSON';
import * as random from './random';

describe('generateGameStartJSON', () => {
    it('should be \'{"type":"gameStart"}\'', () => {
        expect(JSON.parse(sendJSON.generateGameStartJSON())).toEqual({
            type: 'gameStart',
        });
    });
});

describe('Start request test suite', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should', (done) => {
        const callbackfn = jest.fn();
        const mockServerAddress = random.string(5);
        sendJSON.gameStartRequest(mockServerAddress, callbackfn);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress, true);
        expect(callbackfn).not.toHaveBeenCalled();
        mockXHR.onreadystatechange();
        expect(callbackfn).toHaveBeenCalledWith(mockXHR);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({type: 'gameStart'}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });
});

describe('sendJSON test suite', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should', (done) => {
        const succCallback = jest.fn();
        const failureCallback = jest.fn();
        const mockServerAddress = random.string(5);
        const mockJSON = {test: random.string(5)};
        sendJSON.sendJSON({
            serverAddress: mockServerAddress,
            successCallback: succCallback,
            jsonObject: mockJSON,
        });
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress);
        expect(succCallback).not.toHaveBeenCalled();
        mockXHR.readyState = 4;
        mockXHR.state = 200;
        mockXHR.onreadystatechange();
        expect(succCallback).toHaveBeenCalledWith(mockXHR);
        mockXHR.state = 404;
        mockXHR.onreadystatechange();
        expect(failureCallback).toHaveBeenCalledWith(mockXHR);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify(mockJSON));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });
});
