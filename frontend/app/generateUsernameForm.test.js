import * as usernameForm from './generateUsernameForm';
import * as random from './random';

describe('Request sent on function call', () => {
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
        const callbackfn = jest.fn();
        const mockServerAddress = random.string(5);
        usernameForm.requestUserID(mockServerAddress, '', callbackfn);
        expect(mockXHR.open).toHaveBeenCalledWith('POST', mockServerAddress, true);
        expect(callbackfn).not.toHaveBeenCalled();
        mockXHR.onreadystatechange();
        expect(callbackfn).toHaveBeenCalledWith(mockXHR);
        expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify({user: ''}));
        expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=UTF-8');
        done();
    });
});

describe('Generate form to the body of ', () => {
    // let page;

    beforeAll(() => {
        // page = document.body.innerHTML;
    });

    afterAll(() => {
        // document.body.innerHTML = page;
    });

    test('if generated form is successful ', (done) => {
        const callback = jest.fn();
        usernameForm.generateUsernameForm(callback);
        expect(document.getElementById('submit_username').value).toEqual('Submit');
        expect(document.body.innerHTML).toEqual('<form><label for="username">Enter username:</label><input type="text" id="username"><br><input type="checkbox" name="confirm_username" id="confirm_username"><span id="checker">I have confirmed my username</span><br><input type="submit" value="Submit" id="submit_username" disabled=""></form>');
        expect(document.getElementById('username').type).toEqual('text');
        done();
    });
});
