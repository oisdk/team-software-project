import * as getGameID from './createGame';

describe('createGame tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();

    // Backup the BOM XMLHttpRequest object to a variable since it will be
    // over-written soon
    const oldXHR = window.XMLHttpRequest;

    // Create a mock XMLHttpRequest with mock methods
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    // Create a mock server AJAX response
    const mockResponse = {
        responseText: '{"game_id": 1}',
    };

    // Function run before each test() below
    beforeEach(() => {
        // Tell the BOM XMLHttpRequest to use the mock XMLHttpRequest
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    // Function run after each test() below
    afterEach(() => {
        // Restore the BOM XMLHttpRequest to its original state
        window.XMLHttpRequest = oldXHR;
    });

    test('getGameID', (done) => {
        getGameID.getGameID(4, mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('successCallback', (done) => {
        getGameID.successCallback(mockResponse);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });
});
