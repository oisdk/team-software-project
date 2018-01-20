// Provides some utilities for generating random data for testing.

// Returns a random integer in the range [min,max).
export function int(min, max) {
    return Math.floor(min + (Math.random() * (max - min)));
}

// Returns a randomly chosen element from the supplied array.
export function choose(x, ...xs) {
    const ind = int(0, xs.length + 1);
    return (ind === 0) ? x : xs[ind - 1];
}

// Returns a random string of the specified length.
export function string(length) {
    return String.fromCodePoint(...Array.from({
        length,
    }, (_i, _x) => int(32, 127)));
}
