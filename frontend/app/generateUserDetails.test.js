import * as generateUserDetails from './generateUserDetails';

describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockLogUpdater = jest.fn();
    const mockResponse = {responseText: '{"your_rolls": "(1,2)", "card_details": "card description"}'};
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('rollDice', (done) => {
        generateUserDetails.rollDice(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateUserDetails.endTurn(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('successCallback', (done) => {
        generateUserDetails.successCallback(mockResponse, mockLogUpdater);
        jest.spyOn(global.console, 'log');
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        expect(mockLogUpdater).toHaveBeenCalledWith('card description');
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateUserDetails.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableGameInterface', (done) => {
        generateUserDetails.enableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableEndTurn', (done) => {
        generateUserDetails.enableEndTurn();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled=""'));
        done();
    });
});

describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockLogUpdater = jest.fn();
    const mockResponse = {responseText: '{"your_rolls": "(1,2)", "card_details": "card description"}'};
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('rollDice', (done) => {
        generateUserDetails.rollDice(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateUserDetails.endTurn(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('successCallback', (done) => {
        generateUserDetails.successCallback(mockResponse, mockLogUpdater);
        jest.spyOn(global.console, 'log');
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        expect(mockLogUpdater).toHaveBeenCalledWith('card description');
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateUserDetails.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        expect(document.getElementById('jail').hasAttribute('disabled'));
        done();
    });

    test('enableGameInterface', (done) => {
        generateUserDetails.enableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableEndTurn', (done) => {
        generateUserDetails.enableEndTurn();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled=""'));
        done();
    });
});


/*
describe('onPlayerMove', () => {
    const oldDocumentBody = document.body;
    const mockPlayerMoveEvent = {data: '[[1, 10]]'};
    const mockPlayerList = {1: 'test', 2: 'test2'};

    beforeAll(() => {
        document.body.innerHTML = '<div id="content"></div>';
        activeGame.displayBoard(mockPlayerList);
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should call movePlayer', () => {
        activeGame.onPlayerMove(mockPlayerMoveEvent);
        expect(control.movePlayer).toHaveBeenCalledWith(1, 10);
    });
});
*/

describe('turnDetails', () => {
    const oldDocumentBody = document.body;
    const mockPlayerTurnEvent = {data: '1'};

    beforeAll(() => {
        document.body.innerHTML = '<table><tr><td id="current-turn"></td></tr></table><button id="roll-dice">Roll Dice</button><button id="mort-check" name="mortgage">Mortgage</button><button id="unmort-check" name="unmortgage">Unmortgage</button><button id="end-turn">End Turn</button><button id="jail">Jail</button>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should set active player', () => {
        generateUserDetails.turnDetails(mockPlayerTurnEvent);
        expect(document.getElementById('current-turn').innerHTML).toEqual('Player NaN');
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
    });
});

describe('balanceDetails', () => {
    const oldDocumentBody = document.body;
    const mockPlayerBalanceEvent = {data: '[[1, 200]]'};

    beforeAll(() => {
        document.body.innerHTML = '<table><tr><td id="balance"></td></tr></table>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should set players balance', () => {
        generateUserDetails.balanceDetails(mockPlayerBalanceEvent);
        expect(document.getElementById('balance').innerHTML).toEqual('');
    });
});
