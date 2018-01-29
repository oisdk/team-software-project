import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';

describe('updatePage test', () => {
    const oldDocumentBody = document.body.innerHTML;

    const mockFileResponse = {
        responseText: '<p>test html content</p>',
    };

    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateCreateJoinGamePage.updatePage(mockFileResponse);
        expect(document.body.innerHTML).toEqual('<p>test html content</p>');
        done();
    });
});


describe('generateCreateJoinGamePage test', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should call appropriate XMLHttpRequest functions', (done) => {
        generateCreateJoinGamePage.generateCreateJoinGamePage();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'create-join-game.html', true);
        done();
    });
});
