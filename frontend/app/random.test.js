import * as random from './random';

describe('getRandomNumber', () => {
  it('should be 4', () => {
    expect(random.getRandomNumber()).toBe(4);
  });
});

describe('getRandomNumbers', () => {
  it('should be [4,5]', () => {
    expect(random.getTwoRandomNumbers()).toEqual([4, 4]);
  });
});
