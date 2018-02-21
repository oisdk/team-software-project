import * as generateUserDetails from './generateUserDetails';

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
        document.body.innerHTML = '<div id="content-right"></div>';
        document.cookie = 'user_name=testuser';
    });

    // Restore the HTML body to its state before the test and delete the cookie
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
        document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });

    test('should read mockFileResponse and update page with its contents', (done) => {
        generateUserDetails.updateUserDetails(mockFileResponse);
        expect(document.getElementById('content-right').innerHTML).toEqual('<table><tbody><tr><th>Username:</th><th>Balance:</th><th>Current Turn:</th><th>Properties Owned:</th></tr><tr><td id="details_username">undefined</td><td id="balance"></td><td id="current-turn"></td><td id="properties"></td></tr></tbody></table>');
        expect(document.getElementById('details_username').innerHTML).toEqual('undefined');
        done();
    });
});

describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockResponse = {responseText: '{"your_rolls": "(1,2)"}'};
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('rollDice', (done) => {
        generateUserDetails.rollDice(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateUserDetails.endTurn(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('successCallback', (done) => {
        generateUserDetails.successCallback(mockResponse);
        jest.spyOn(global.console, 'log');
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateUserDetails.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableGameInterface', (done) => {
        generateUserDetails.enableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableEndTurn', (done) => {
        generateUserDetails.enableEndTurn();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled=""'));
        done();
    });
});

describe('rollDice endTurn successCallback tests', () => {
    // Create a mock for the actual sendJSON function
    const mockSendJSON = jest.fn();
    const mockResponse = {responseText: '{"your_rolls": "(1,2)"}'};
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('rollDice', (done) => {
        generateUserDetails.rollDice(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        done();
    });

    test('endTurn', (done) => {
        generateUserDetails.endTurn(mockSendJSON);
        expect(mockSendJSON).toHaveBeenCalled();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('successCallback', (done) => {
        generateUserDetails.successCallback(mockResponse);
        jest.spyOn(global.console, 'log');
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });
});

describe('disable button tests', () => {
    // Create a mock for the actual sendJSON function
    const oldDocumentBody = document.body;


    // Create buttons to test
    beforeAll(() => {
        document.body.innerHTML = '<button id="roll-dice"></button><button id="end-turn"></button>';
    });

    // Restore the HTML body
    afterAll(() => {
        document.body.innerHTML = oldDocumentBody;
    });


    test('disableGameInterface', (done) => {
        generateUserDetails.disableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableGameInterface', (done) => {
        generateUserDetails.enableGameInterface();
        expect(document.getElementById('roll-dice').hasAttribute('disabled=""'));
        expect(document.getElementById('end-turn').hasAttribute('disabled'));
        done();
    });

    test('enableEndTurn', (done) => {
        generateUserDetails.enableEndTurn();
        expect(document.getElementById('roll-dice').hasAttribute('disabled'));
        expect(document.getElementById('end-turn').hasAttribute('disabled=""'));
        done();
    });
});
