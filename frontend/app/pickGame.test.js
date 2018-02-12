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
        const pickGame = jest.fn();
        functionCall.requestGameList();
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'cgi-bin/request_games_list.py', true);
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        expect(mockXHR.send).toHaveBeenCalledWith();
        functionCall.requestGameList();
        mockXHR.onreadystatechange();
        expect(pickGame).not.toHaveBeenCalledWith(mockXHR);
        done();
    });
});

describe('Generate list of games ', () => {
    const oldDocumentBody = document.body;
    const sendGameId = jest.fn();

    // simulate response
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '{"game1":2}',
    };

    beforeAll(() => {
        document.body.innerHTML = '<div id="content"></div>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    test(' generated games ', (done) => {
        expect(document.body.innerHTML).toEqual('<div id="content"></div>');
        functionCall.pickGame(mockFileResponse);
        expect(document.getElementById('content').innerHTML).toEqual('<table id="table"><tbody><tr id="row1"><th>Select</th><th>List of games</th></tr></tbody><tr><td><input type="radio" name="gameID" value="game1"></td><td>game1</td></tr><tr id="tableI"><td><input type="submit" value="Join game" id="joinSelectedGame"></td><td></td></tr></table>');
        const radio = document.querySelector('input[name="gameID"]');
        radio.checked = true;
        expect(document.querySelector('input[name="gameID"]:checked')).not.toBeNull();
        expect(document.querySelector('input[name="gameID"]:checked')).not.toBe(false);
        expect(document.querySelector('input[name="gameID"]:checked')).toBeTruthy();
        expect(document.querySelector('input[name="gameID"]:checked').value).toEqual('game1');
        expect(sendGameId).not.toHaveBeenCalledWith('game1');
        done();
    });
});

describe('send game id to waitingGame function ', () => {
    const game = '<input type="radio" name="gameID" value="game1" checked>';
    const mockWait = jest.fn();
    test(' generated games ', (done) => {
        functionCall.sendGameId(game, mockWait);
        expect(game).not.toBeNull();
        expect(mockWait).toHaveBeenCalled();
        done();
    });
});
