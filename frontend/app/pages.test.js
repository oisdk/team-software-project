import waitingGame from './pages';
import * as sJ from './sendJSON';
import * as random from './random';

describe('waitingGame', () => {
    const oldSJ = sJ.sendJSON;
    const oldDocumentBody = document.body;

    beforeAll(() => {
        document.body.innerHTML = '<div id="content"></div>';
    });

    beforeEach(() => {
        sJ.sendJSON = jest.fn();
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should call sendJSON', () => {
        const mockGameId = random.int(0, 1000);
        waitingGame(mockGameId);
        expect(sJ.sendJSON).toHaveBeenCalled();
        const mockRequest = {responseText: String(random.int(0, 1000))};
        sJ.sendJSON.mock.calls[0][0].successCallback(mockRequest);
        expect(document.getElementById('content').innerHTML).toEqual(`You are in the waiting game ${mockGameId}.
            Here are the details:
            ${mockRequest.responseText}`);
    });

    afterEach(() => {
        sJ.sendJSON = oldSJ;
    });
});
