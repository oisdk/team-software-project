import * as functionCall from './pickGame';

describe('Request sent to get list', () => {
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

    test('should request userID', (done) => {
        functionCall.requestGameList();
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'get_games.py', true);
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        expect(mockXHR.send).toHaveBeenCalledWith();
        done();
    });
});

describe('Should call function on response of request', () => {
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

    test('should request userID', (done) => {
        const pickGame = jest.fn();
        functionCall.requestGameList();
        mockXHR.onreadystatechange();
        expect(pickGame).not.toHaveBeenCalledWith(mockXHR);
        done();
    });
});
