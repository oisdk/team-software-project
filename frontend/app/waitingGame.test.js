import * as pages from './waitingGame';
import * as sse from './sse';
import * as random from './random';

describe('waitingGame', () => {
    const oldDocumentBody = document.body;
    const oldInitialiseEventSource = sse.initialiseEventSource;
    const mockEventSource = {
        addEventListener: jest.fn(),
    };


    beforeAll(() => {
        document.body.innerHTML = '<div id="content"></div>';
    });

    beforeEach(() => {
        sse.initialiseEventSource = jest.fn(() => mockEventSource);
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    it('should call initialiseEventSource', () => {
        const mockGameId = random.int(0, 1000);
        pages.waitingGame(mockGameId);
        expect(sse.initialiseEventSource).toHaveBeenCalledWith(mockGameId);
    });

    afterEach(() => {
        sse.initialiseEventSource = oldInitialiseEventSource;
    });
});

