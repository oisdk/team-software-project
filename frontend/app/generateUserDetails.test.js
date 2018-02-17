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
        responseText: '<table><tbody><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="details_username">undefined</td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></tbody></table>',
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
        expect(document.getElementById('content-left').innerHTML).toEqual('<table><tbody><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="details_username">undefined</td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></tbody></table>');
        expect(document.getElementById('details_username').innerHTML).toEqual('undefined');
        done();
    });
});


describe('generateUserDetails test', () => {
    // Store the current state of the HTML body so it can be restored after the
    // test
    const oldDocumentBody = document.body;
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
        document.body.innerHTML = '<table><tbody><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="details_username">undefined</td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></tbody></table>';
    });

    // Restore the global XMLHttpRequest to the state it was before the tests
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
        window.EventSource = undefined;
        document.body.innerHTML = oldDocumentBody;
    });

    test('should call appropriate XMLHttpRequest/eventSource functions', (done) => {
        generateUserDetails.generateUserDetails();
        expect(mockXHR.open).toHaveBeenCalledWith('GET', 'user-info.html', true);
        const result = initialiseEventSource(mockGameId);
        expect(result).toBe(mockEventSource);
        expect(document.getElementById('current-turn').innerHTML).toEqual('');
        expect(document.getElementById('balance').innerHTML).toEqual('');
        expect(document.getElementById('properties').innerHTML).toEqual('');
        done();
    });
});
