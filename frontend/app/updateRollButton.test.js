import * as functionCall from './updateRollButton';

describe('Request sent to get bool comparision result of roll dice values', () => {
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

    test('Should request the playerID', (done) => {
        const checkRollValuesEqual = jest.fn();
        functionCall.requestCompareRolls();
        expect(mockXHR.open).toHaveBeenCalledWith('POST', 'cgi-bin/compare_dice_rolls.py', true);
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        expect(mockXHR.send).toHaveBeenCalledWith();
        functionCall.requestCompareRolls();
        mockXHR.onreadystatechange();
        expect(checkRollValuesEqual).not.toHaveBeenCalledWith(mockXHR);
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
