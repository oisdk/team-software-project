import * as random from './random';

expect.extend({
    toBeInteger(received) {
        const pass = Number.isInteger(received);
        if (pass) {
            return {
                message: () => `expected ${received} not to be a whole number`,
                pass: true,
            };
        }
        return {
            message: () => `expected ${received} to be a whole number`,
            pass: false,
        };
    },
});

function repeat(times, action) {
    for (let i = 0; i < times; i += 1) {
        action();
    }
}

describe('random.int', () => {
    it('should be an integer', () => {
        repeat(30, () => {
            expect(random.int(0, 100)).toBeInteger();
        });
    });
    it('should be above or equal to the lower bound', () => {
        repeat(30, () => {
            expect(random.int(0, 3)).toBeGreaterThanOrEqual(0);
        });
    });
    it('should be below the upper bound', () => {
        repeat(30, () => {
            expect(random.int(0, 3)).toBeLessThan(3);
        });
    });
});

describe('random.choose', () => {
    it('should return a deterministic value when given only one', () => {
        const dummyObject = {};
        expect(random.choose(dummyObject)).toBe(dummyObject);
    });

    it('should return one of the given objects', () => {
        repeat(30, () => {
            const objA = {};
            const objB = {};
            const objC = {};
            expect([objA, objB, objC]).toContain(random.choose(objA, objB, objC));
        });
    });
});

describe('random.string', () => {
    it('should have the right length', () => {
        repeat(30, () => {
            const randlength = random.int(0, 4);
            expect(random.string(randlength)).toHaveLength(randlength);
        });
    });
});
