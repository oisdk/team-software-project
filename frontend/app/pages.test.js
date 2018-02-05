import waitingGame from './pages';
import * as sJ from './sendJSON';

describe('waitingGame', () => {
    const oldSJ = sJ.sendJSON;

    beforeEach(() => {
        sJ.sendJSON = jest.fn();
    });

    it('should call sendJSON', () => {
        waitingGame();
        expect(sJ.sendJSON).toHaveBeenCalled();
    });

    afterEach(() => {
        sJ.sendJSON = oldSJ;
    });
});
