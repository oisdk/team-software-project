import * as functionCall from './updateRollButton';

describe('Request sent to get bool comparision result of roll dice values', () => {
    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };

    const mockCompare = jest.fn();

    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();

    // Create a mock Ajax response
    const mockResponse = {responseText: '{player_id: [2, 1]}'};

    const oldXMLHttpRequest = window.XMLHttpRequest;

    // Function runs before test
    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    // Function runs after test
    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('getRolls', (done) => {
        functionCall.processRollButton(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('checkRollValuesEqual', (done) => {
        functionCall.checkRollValuesEqual(mockResponse);
        expect(mockCompare).toHaveBeenCalledWith(JSON.parse(mockResponse));
        done();
    });
});

describe('Disable roll button ', () => {
    const oldDocumentBody = document.body.innerHTML;

    // simulate response
    const mockFileResponse = {
        responseText: '{player_id: [2, 1]}',
    };

    beforeAll(() => {
        document.body.innerHTML = '<button type="button" id="roll">Roll die</button>';
    });

    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });

    test(' disable button ', (done) => {
        functionCall.checkRollValuesEqual(mockFileResponse);
        done();
    });
});
