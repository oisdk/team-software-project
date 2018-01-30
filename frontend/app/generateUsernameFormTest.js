import * as usernameForm from './generateUsernameForm';

describe('generateUsernameForm should generate username form', () => {
    let originalHtml;

    beforeAll(() => {
        originalHtml = document.body.innerHTML;
        document.body.innerHTML = '<!DOCTYPE HTML> <html lang="en"> <head> <meta http-equiv="content-type" content="text/html; charset=utf-8"><script src="bundle.js"></script><link rel="stylesheet" href="styles.css"><title>Monopoly</title></head><body></body></html>';
    });

    afterAll(() => {
        document.body.innerHTML = originalHtml;
    });

    test('should detect username form', (done) => {
        usernameForm.generateUsernameForm();
        expect(document.getELementById('username').value).toEqual('');
        done();
    });
});
