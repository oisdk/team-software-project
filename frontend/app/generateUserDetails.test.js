import * as generateUserDetails from './generateUserDetails';

describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button><button id="buy-house">Buy House</button>';
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
        expect(document.getElementById('jail').hasAttribute('disabled'));
        expect(document.getElementById('buy-house').hasAttribute('disabled'));
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button><button id="jail">Jail</button><button id="buy-house">Buy House</button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateUserDetails.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        expect(document.getElementById('buy-house').hasAttribute('disabled'));
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
