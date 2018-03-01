import * as activeGame from './activeGame';
// import * as control from './moveFunctions';

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

describe('onPlayerTurn', () => {
    const oldDocumentBody = document.body;
    const mockPlayerTurnEvent = {data: '1'};

    beforeAll(() => {
        document.body.innerHTML = '<table><tr><td id="current-turn"></td></tr></table><button id="roll-dice">Roll Dice</button><button id="mort-check">Mortgage</button><button id="unmort-check">Unmortgage</button><button id="end-turn">End Turn</button>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should set active player', () => {
        activeGame.onPlayerTurn(mockPlayerTurnEvent);
        expect(document.getElementById('current-turn').innerHTML).toEqual('Player 1');
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
    });
});

describe('onPlayerBalance', () => {
    const oldDocumentBody = document.body;
    const mockPlayerBalanceEvent = {data: '[[1, 200]]'};

    beforeAll(() => {
        document.body.innerHTML = '<table><tr><td id="balance"></td></tr></table>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should set players balance', () => {
        activeGame.onPlayerBalance(mockPlayerBalanceEvent);
        expect(document.getElementById('balance').innerHTML).toEqual('');
    });
});

