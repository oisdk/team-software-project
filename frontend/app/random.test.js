import * as random from './random';

describe('getRandomNumber', () => {
    it('should be 4', () => {
        expect(random.getRandomNumber()).toBe(4);
    });
});

describe('geAnothertRandomNumber', () => {
    it('should be 4', () => {
        expect(random.getAnotherRandomNumber()).toBe(4);
    });
});
