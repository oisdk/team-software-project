import * as generateUserDetails from './generateUserDetails';
import {initialiseEventSource} from './sse';

describe('updateUserDetails test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;


    // Create a mock XMLHttpRequest response which contains a HTML page
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: '<table><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="username"></td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></table>',
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
        generateUserDetails.updateUserDetails(mockFileResponse);
        expect(document.getElementById('content-left').innerHTML).toEqual('<table><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="username"></td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></table>');
        done();
    });
});


describe('generateUserDetails test', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;
    const mockGameId = 1;
    let mockEventSource;

    // Create a mock XMLHttpRequest object
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Assign the global window XMLHttpRequest to point to the mockXHR object
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
        mockEventSource = {
            addEventListener: jest.fn(),
        };
        window.EventSource = jest.fn(() => mockEventSource);
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
        window.EventSource = undefined;
    });

    test('should call appropriate XMLHttpRequest/eventSource functions', (done) => {
        generateUserDetails.generateUserDetails();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'user-info.html', true);
        const result = initialiseEventSource(mockGameId);
        expect(result).toBe(mockEventSource);
        done();
    });
});
