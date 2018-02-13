import * as generateGameInterface from './generateGameInterface';

describe('updateGamePage test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;


    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '<button id="roll-dice" name="roll-dice">Roll Dice</button><br><button id="end-turn" name="end-turn">End Turn</button>',
    };

    // Create a user_name cookie
    beforeAll(() => {
        document.body.innerHTML = '<div id="content-right"></div>';
        document.cookie = 'user_name=testuser';
    });

    // Restore the HTML body to its state before the test and delete the cookie
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateGameInterface.updateGamePage(mockFileResponse);
        expect(document.getElementById('content-right').innerHTML).toEqual('<button id="roll-dice" name="roll-dice">Roll Dice</button><br><button id="end-turn" name="end-turn">End Turn</button>');
        done();
    });
});


describe('generateGameInterface test', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    // Create a mock XMLHttpRequest object
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should call appropriate XMLHttpRequest functions', (done) => {
        generateGameInterface.generateGameInterface();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'game-interface.html', true);
        done();
    });
});


describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockResponse = {responseText: '{"game_id": 1}'};


    test('rollDice', (done) => {
        generateGameInterface.rollDice();
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateGameInterface.endTurn();
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('successCallback', (done) => {
        generateGameInterface.successCallback(mockResponse);
        done();
    });
});
