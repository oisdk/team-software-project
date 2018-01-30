import * as usernameForm from './generateUsernameForm';
import * as random from './random';

describe('generateUsernameForm should generate username form', () => {
    let originalHtml;

    beforeAll(() => {
        originalHtml = document.body.innerHTML;
        document.body.innerHTML = '<form>Enter Username <input type="text" id="username"><input type="submit" value="Submit" id="submit_suername"></form>';
    });

    afterAll(() => {
        document.body.innerHTML = originalHtml;
    });

    test('should detect username form', (done) => {
        usernameForm.generateUsernameForm();
        expect(document.getELementById('username').value).toEqual('');
        expect(document.getELementById('submit_username').type).toEqual('text');
        done();
    });
});

describe('Request sent', () => {
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

    test('should request userID', (done) => {
        const username = JSON.stringify({user: ' '});
        const callbackfn = jest.fn();
        const mockServerAddress = random.string(5);
        usernameForm.requestUserID(mockServerAddress, '', callbackfn);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress, true);
        expect(callbackfn).not.toHaveBeenCalled();
        mockXHR.onreadystatechange();
        expect(callbackfn).toHaveBeenCalledWith(mockXHR);
        expect(mockXHR.send).toHaveBeenCalledWith(username);
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });
});
