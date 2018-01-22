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
