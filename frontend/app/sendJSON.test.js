import * as sendJSON from './sendJSON';

describe('generateJSON', () => {
    it('should be \'{"type":"gameStart"}\'', () => {
        expect(sendJSON.generateJSON()).toBe('{"type":"gameStart"}');
    });
});

describe('sendJSONToServer', () => {
    it('should be [0, \'{"type":"gameStart"}\']', () => {
        expect(sendJSON.sendJSONToServer()).toEqual([0, '{"type":"gameStart"}']);
    });
});

describe('sendJSONToServer', () => {
    it('should be [0, \'{"testkey":"testValue"}\']', () => {
        expect(sendJSON.sendJSONToServer({ testkey: 'testValue' })).toEqual([0, '{"testkey":"testValue"}']);
    });
});
