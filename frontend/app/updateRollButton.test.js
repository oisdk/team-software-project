import * as functionCall from './updateRollButton';

describe('Request sent to get bool comparision result of roll dice values', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    const mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
    };
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();

    beforeEach(() => {
        window.XMLHttpRequest = jest.fn(() => mockXHR);
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('getBoolean', (done) => {
        functionCall.requestCompareRolls(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });
});

describe('Disable roll button ', () => {
    const oldDocumentBody = document.body.innerHTML;

    // simulate response
    const mockFileResponse = {
        status: 200,
        readyState: 4,
        responseText: 'true',
    };

    beforeAll(() => {
        document.body.innerHTML = '<button type="button" id="roll">Roll die</button>';
    });

    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });

    test(' disable button ', (done) => {
        functionCall.checkRollValuesEqual(mockFileResponse);
        expect(document.body.innerHTML).toEqual('<button type="button" id="roll">Roll die</button>');
        done();
    });
});
