import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';

describe('updatePage test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;


    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '<p>test html content<i id="username"></i></p><button id="join-game" name="join-game">Join Existing Game</button><br><button id="create-game" name="create-game">Create a New Game</button>',
    };

    // Create a user_name cookie which will be read by updatePage to customise
    // the create/join page
    beforeAll(() => {
        document.body.innerHTML = '<div id="content"></div>';
        document.cookie = 'user_name=testuser';
    });

    // Restore the HTML body to its state before the test and delete the cookie
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateCreateJoinGamePage.updatePage(mockFileResponse);
        expect(document.getElementById('content').innerHTML).toEqual('<p>test html content<i id="username">testuser</i></p><button id="join-game" name="join-game">Join Existing Game</button><br><button id="create-game" name="create-game">Create a New Game</button>');
        done();
    });
});


describe('generateCreateJoinGamePage test', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    // Create a mock XMLHttpRequest object
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('should call appropriate XMLHttpRequest functions', (done) => {
        generateCreateJoinGamePage.generateCreateJoinGamePage();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'create-join-game.html', true);
        done();
    });
});
