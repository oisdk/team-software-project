import * as generateGameInterface from './generateGameInterface';
import {initialiseEventSource} from './sse';

describe('updateGamePage test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;


    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '<button id="roll-dice" name="roll-dice" disabled="">Roll Dice</button><br><button id="end-turn" name="end-turn" disabled="">End Turn</button>',
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
        expect(document.getElementById('content-right').innerHTML).toEqual('<button id="roll-dice" name="roll-dice" disabled="">Roll Dice</button><br><button id="end-turn" name="end-turn" disabled="">End Turn</button>');
        done();
    });
});


describe('generateGameInterface test', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;
    const mockGameId = 1;
    let mockEventSource;

    // Create a mock XMLHttpRequest object
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
        mockEventSource = {
            addEventListener: jest.fn(),
        };
        window.EventSource = jest.fn(() => mockEventSource);
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
        window.EventSource = undefined;
    });

    test('should call appropriate XMLHttpRequest/eventSource functions', (done) => {
        generateGameInterface.generateGameInterface();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'game-interface.html', true);
        const result = initialiseEventSource(mockGameId);
        expect(result).toBe(mockEventSource);
        done();
    });
});


describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockResponse = {responseText: '{"your_rolls": "(1,2)"}'};
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('rollDice', (done) => {
        generateGameInterface.rollDice(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateGameInterface.endTurn(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('successCallback', (done) => {
        generateGameInterface.successCallback(mockResponse);
        jest.spyOn(global.console, 'log');
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateGameInterface.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableGameInterface', (done) => {
        generateGameInterface.enableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableEndTurn', (done) => {
        generateGameInterface.enableEndTurn();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled=""'));
        done();
    });
});
