import waitingGame from './pages';
import * as sJ from './sendJSON';

describe('waitingGame', () => {
    it('should call sendJSON', () => {
        expect(sJ.sendJSON)toHaveBeenCalled();
    });
});
