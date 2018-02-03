import * as checkButton from './checkButton';

describe('checkTextField should succeed with populated username field', () => {
    const oldDocumentBody = document.body;

    beforeAll(() => {
        document.body.innerHTML = '<form><input type="text" id="username" value="testuser"><input type="submit" value="Submit" id="submit_username" disabled><span id="checker"></span></form>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    test('should display confirmation and enable submit button', () => {
        checkButton.checkTextField();
        expect(document.body.innerHTML).toEqual('<form><input type="text" id="username" value="testuser" disabled=""><input type="submit" value="Submit" id="submit_username"><span id="checker">Username is confirmed</span></form>');
    });
});

describe('checkTextField should fail since username field unpopulated', () => {
    const oldDocumentBody = document.body;

    beforeAll(() => {
        document.body.innerHTML = '<form><input type="text" id="username"><input type="submit" value="Submit" id="submit_username"><span id="checker"></span></form>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    test('should display error message', () => {
        checkButton.checkTextField();
        expect(document.body.innerHTML).toEqual('<form><input type="text" id="username"><input type="submit" value="Submit" id="submit_username"><span id="checker">Username hasn\'t been entered</span></form>');
    });
});

describe('checkTextField should fail since username field is all whitespaces', () => {
    const oldDocumentBody = document.body;

    beforeAll(() => {
        document.body.innerHTML = '<form><input type="text" id="username" value="   "><input type="submit" value="Submit" id="submit_username"><span id="checker"></span></form>';
    });

    afterAll(() => {
        document.body = oldDocumentBody;
    });

    test('should display error message', () => {
        checkButton.checkTextField();
        expect(document.body.innerHTML).toEqual('<form><input type="text" id="username" value="   "><input type="submit" value="Submit" id="submit_username"><span id="checker">Username hasn\'t been entered</span></form>');
    });
});

describe('validateUsername should an event listener to username field', () => {
    let eventListener;
    let htmlUsername;

    beforeAll(() => {
        eventListener = jest.fn();
        htmlUsername = document.createElement('input');
        htmlUsername.type = 'text';
        htmlUsername.id = 'username';
    });

    test('username should have event listener attached', (done) => {
        checkButton.validateUsername(eventListener);
        expect(eventListener).not.toHaveBeenCalled();
        done();
    });
});
