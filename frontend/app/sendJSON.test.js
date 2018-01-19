import * as sendJSON from './sendJSON';

describe('generateJSON', () => {
    it('should be \'{"type":"gameStart"}\'', () => {
        expect(sendJSON.generateJSON()).toBe('{"type":"gameStart"}');
    });
});

describe('sendJSONToServer', () => {
    it('should be false', () => {
        expect(sendJSON.sendJSONToServer()).toBe(false);
    });
});
