import * as generateCreateJoinGamePage from './generateCreateJoinGamePage';

describe('updatePage test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body.innerHTML;

    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        responseText: '<p>test html content<i id="username"></i></p>',
    };

    // Create a user_name cookie which will be read by updatePage to customise
    // the create/join page
    beforeAll(() => {
        document.cookie = 'user_name=testuser';
    });

    // Restore the HTML body to its state before the test and delete the cookie
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateCreateJoinGamePage.updatePage(mockFileResponse);
        // The <i> tag is to be filled with "testuser" once the commented code
        // is uncommented in updatePage()
        expect(document.body.innerHTML).toEqual('<p>test html content<i id="username"></i></p>');
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
        expect(mockXHR.open).toHaveBeenCalledWith('GET', '../html/create-join-game.html', true);
        done();
    });
});
