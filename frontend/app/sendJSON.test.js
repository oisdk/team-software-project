import * as sendJSON from './sendJSON';

describe('generateJSON', () => {
    it('should be \'{"type":"gameStart"}\'', () => {
        expect(sendJSON.generateJSON(null)).toBe('{"type":"gameStart"}');
    });
});

describe('generateJSON', () => {
    it('should be \'{"testkey":"testValue"}\'', () => {
        expect(sendJSON.generateJSON({ testkey: 'testValue' })).toBe('{"testkey":"testValue"}');
    });
});

describe('sendJSONToServer', () => {
    it('should be [0, \'{"key":"value"}\']', () => {
        expect(sendJSON.sendJSONToServer({ key: 'value' })).toEqual([0, '{"key":"value"}']);
    });
});
