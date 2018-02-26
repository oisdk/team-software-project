import * as generateGameLog from './generateGameLog';


describe('updateLogPage test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;


    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '<h1>Game Log</h1><textarea rows="5" cols="100" id="game-log"></textarea>',
    };

    // Create a user_name cookie
    beforeAll(() => {
        document.body.innerHTML = '<div id="content-left"></div>';
        document.cookie = 'user_name=testuser';
    });

    // Restore the HTML body to its state before the test and delete the cookie
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateGameLog.updateLogPage(mockFileResponse);
        expect(document.getElementById('content-left').innerHTML).toEqual('<h1>Game Log</h1><textarea rows="5" cols="100" id="game-log"></textarea>');
        done();
    });
});

/*
describe('updateGameLog test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;
    const mockResponse = 'Player 2 rolled a 10';

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        document.body.innerHTML = '<h1>Game Log</h1>
        <textarea rows="5" cols="100" id="game-log"></textarea>';
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        document.body.innerHTML = oldDocumentBody;
    });

    test('should update textarea appropriately', (done) => {
        generateGameLog.updateGameLog(mockResponse);
        expect(document.body.innerHTML).toEqual
        ('<h1>Game Log</h1><textarea rows="5" cols="100" id="game-log"></textarea>');
        done();
    });
});
*/
