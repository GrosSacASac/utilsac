import test from 'ava';
import { deepDifference } from '../../deep.js';

test(`deep difference should return new object with keys Additions, Removals, Changes`, t => {
    const a = {
        same: 7,
        x: 30,
        w: 20,
        deep: {},
    };

    const b = {
        same: 7,
        x: 15,
        z: 10,
        deep: {
            deeper: 99,
        },
    };

    const result = deepDifference(a, b);
    t.deepEqual(result, {
        additions: [
            {
                name: [`deep`, `deeper`],
                value: 99,
            },
            {
                name: [`z`],
                value: 10,
            },
        ],
        removals: [
            {
                name: [`w`],
                value: 20,
            },
        ],
        changes: [
            {
                name: [`x`],
                oldValue: 30,
                newValue: 15,
            },
        ],
    });
});
