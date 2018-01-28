import * as checkButton from './checkButton';

describe('checkTextField should return false since username is populated', () => {
    // Setup function create mock HTML page
    beforeAll(() => {
        // Create a mock HTML page body with the username field populated.
        // This "document" is like an invisible HTML page in node.js which can
        // be treated like a regular HTML page. The HTML form below is copied
        // directly from the live HTML.
        document.body.innerHTML = '<form><label for="username">Username:</label><input type="text" id="username" maxlength="20" value="testuser"><input type="checkbox" name="confirm_username" id="confirm_username"><span id="checker">I have confirmed my username</span><input type="submit" value="Submit" id="usernameInput"></form><button type="button" id="roll_die" disabled>Roll die</button>';
    });

    // This is the actual test which calls the JavaScript and compares the
    // return value with 'false'.
    test('should successfully detect username text and return false', () => {
        expect(checkButton.checkTextField()).toBe(false);
    });
});

describe('checkTextField should return true since username is not populated', () => {
    // Setup function create mock HTML page
    beforeAll(() => {
        // Create a mock HTML page body with the username field not populated.
        document.body.innerHTML = '<form><label for="username">Username:</label><input type="text" id="username" maxlength="20"><input type="checkbox" name="confirm_username" id="confirm_username"><span id="checker">I have confirmed my username</span><input type="submit" value="Submit" id="usernameInput"></form><button type="button" id="roll_die" disabled>Roll die</button>';
    });

    test('should find blank username field and return true', () => {
        expect(checkButton.checkTextField()).toBe(true);
    });
});

describe('boxChecked confirms checkUsername box is checked and username field is populated', () => {
    // Setup function create mock HTML page
    beforeAll(() => {
        // Create a mock HTML page body with the username field populated and
        // confirm_username checkbox is checked.
        document.body.innerHTML = '<form><label for="username">Username:</label><input type="text" id="username" maxlength="20" value="testuser"><input type="checkbox" name="confirm_username" id="confirm_username" checked><span id="checker">I have confirmed my username</span><input type="submit" value="Submit" id="usernameInput"></form><button type="button" id="roll_die" disabled>Roll die</button>';
    });

    // This test waits for all expect() functions to complete before exiting,
    // hence it has done() at the end and takes a done parameter.
    test('should disable the username text field, disable the confirm_username checkbox, enable the roll_die button, and place "Username is confirmed" into the checker span', (done) => {
        checkButton.boxChecked();
        expect(document.getElementById('username').disabled).toBe(true);
        expect(document.getElementById('confirm_username').disabled).toBe(true);
        expect(document.getElementById('roll_die').disabled).toBe(false);
        expect(document.getElementById('checker').innerHTML).toEqual('Username is confirmed');
        done();
    });
});

describe('boxChecked shows warning message due to unpopulated username field', () => {
    // Setup function create mock HTML page
    beforeAll(() => {
        // Create a mock HTML page body with the username field unpopulated and
        // confirm_username checkbox is checked.
        document.body.innerHTML = '<form><label for="username">Username:</label><input type="text" id="username" maxlength="20"><input type="checkbox" name="confirm_username" id="confirm_username" checked><span id="checker">I have confirmed my username</span><input type="submit" value="Submit" id="usernameInput"></form><button type="button" id="roll_die" disabled>Roll die</button>';
    });

    // This test waits for all expect() functions to complete before exiting,
    // hence it has done() at the end and takes a done parameter.
    test('should place "Username hasn\'t been entered" into the checker span', (done) => {
        checkButton.boxChecked();
        expect(document.getElementById('checker').innerHTML).toEqual('Username hasn\'t been entered');
        done();
    });
});

describe('boxChecked takes no action due to confirm_username box unchecked', () => {
    // Setup function create mock HTML page
    beforeAll(() => {
        // Create a mock HTML page body with confirm_username checkbox left unchecked.
        document.body.innerHTML = '<form><label for="username">Username:</label><input type="text" id="username" maxlength="20"><input type="checkbox" name="confirm_username" id="confirm_username"><span id="checker">I have confirmed my username</span><input type="submit" value="Submit" id="usernameInput"></form><button type="button" id="roll_die" disabled>Roll die</button>';
    });

    test('should return undefined', () => {
        expect(checkButton.boxChecked()).toEqual(undefined);
    });
});