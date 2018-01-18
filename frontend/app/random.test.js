import * as random from './random';

describe('getRandomNumber', () => {
  it('should be 4', () => {
    expect(random.getRandomNumber()).toBe(4);
  });
});
