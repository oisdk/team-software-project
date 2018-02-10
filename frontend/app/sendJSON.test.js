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

describe('noOp function', () => {
    it('should be callable and return undefined', () => {
        expect(sendJSON.noOp()).toEqual(undefined);
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

    test('should send JSON', (done) => {
        const mockJSON = {test: random.string(5)};
        sendJSON.sendJSON({
            jsonObject: mockJSON,
        });
        expect(mockXHR.open).toHaveBeenCalledWith('POST', undefined);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify(mockJSON));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });

    test('should send server address', (done) => {
        const mockServerAddress = random.string(5);
        sendJSON.sendJSON({
            serverAddress: mockServerAddress,
        });
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress);
        expect(mockXHR.send).toHaveBeenCalledWith('{}');
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });

    test('should only call success callback on successful response', (done) => {
        const failCallback = jest.fn();
        const succCallback = jest.fn();
        sendJSON.sendJSON({
            successCallback: succCallback,
            failureCallback: failCallback,
        });
        expect(succCallback).not.toHaveBeenCalled();
        mockXHR.readyState = 4;
        mockXHR.status = 200;
        mockXHR.onreadystatechange();
        expect(succCallback).toHaveBeenCalledWith(mockXHR);
        expect(failCallback).not.toHaveBeenCalled();
        done();
    });

    test('should only call failure callback on failure response', (done) => {
        const failCallback = jest.fn();
        const succCallback = jest.fn();
        sendJSON.sendJSON({
            failureCallback: failCallback,
            successCallback: succCallback,
        });
        expect(failCallback).not.toHaveBeenCalled();
        mockXHR.readyState = 4;
        mockXHR.status = 404;
        mockXHR.onreadystatechange();
        expect(failCallback).toHaveBeenCalledWith(mockXHR);
        expect(succCallback).not.toHaveBeenCalled();
        done();
    });

    test('shouldn’t call callbacks on wrong ready state', (done) => {
        const failCallback = jest.fn();
        const succCallback = jest.fn();
        sendJSON.sendJSON({
            failureCallback: failCallback,
            successCallback: succCallback,
        });
        mockXHR.readyState = 3;
        mockXHR.status = 200;
        mockXHR.onreadystatechange();
        expect(failCallback).not.toHaveBeenCalled();
        expect(succCallback).not.toHaveBeenCalled();
        done();
    });
});
