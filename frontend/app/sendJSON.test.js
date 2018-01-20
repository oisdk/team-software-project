import * as sendJSON from './sendJSON';

const testObject = { key: 'value' };

describe('generateJSON', () => {
    it('should be \'{"type":"gameStart"}\'', () => {
        expect(sendJSON.generateJSON(null)).toBe('{"type":"gameStart"}');
    });
});

describe('generateJSON', () => {
    it('should be \'{"testkey":"testValue"}\'', () => {
        expect(sendJSON.generateJSON(testObject)).toBe('{"key":"value"}');
    });
});

describe('sendJSONToServer', () => {
    it('should be [0, \'{"key":"value"}\']', () => {
        expect(sendJSON.sendJSONToServer(testObject)).toEqual([0, '{"key":"value"}']);
    });
});
