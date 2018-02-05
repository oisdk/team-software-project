import waitingGame from './pages';
import * as sJ from './sendJSON';
import * as random from './random';

describe('waitingGame', () => {
    const oldSJ = sJ.sendJSON;

    beforeEach(() => {
        sJ.sendJSON = jest.fn();
    });

    it('should call sendJSON', () => {
        const mockGameId = random.int(0, 1000);
        waitingGame(mockGameId);
        expect(sJ.sendJSON).toHaveBeenCalled();
        const mockRequest = {responseText: String(random.int(0, 1000))};
        sJ.sendJSON.mock.calls[0][0].successCallback(mockRequest);
        expect(document.body.innerHTML).toEqual(`You are in the waiting game ${mockGameId}.
            Here are the details:
            ${mockRequest.responseText}`);
    });

    afterEach(() => {
        sJ.sendJSON = oldSJ;
    });
});
