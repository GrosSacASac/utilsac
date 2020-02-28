/* eslint-disable comma-dangle */
import test from "ava";
import { deepCopy, deepCopyAdded } from "../../deep.js";
import { primitives } from "../helper.js";

const runBaselineDeepCopyTests = deepCopyImplementation => {
    const { name } = deepCopyImplementation;
    test(`${name} should work like an assignement for primitives`, t => {
        primitives.forEach(value => {
            const result = deepCopyImplementation(value);
            t.is(result, value);
        });
    });

    test(`${name} should not work like an assignement for non primitives`, t => {
        const source = {
            a: 1
        };

        const result = deepCopyImplementation(source);
        t.not(result, source);
    });

    test(`${name} result should be deep equal`, t => {
        const source = {
            a: 1,
            b: {
                c: 2,
                d: [1024, 6, 8]
            }
        };

        const result = deepCopyImplementation(source);
        t.deepEqual(result, source);
    });

    test(`${name} should create new object references`, t => {
        const source = {
            a: 1,
            b: {
                c: 2
            }
        };

        const result = deepCopyImplementation(source);
        result.b.c = 3;

        t.is(source.b.c, 2);
    });

    test(`${name} should work with Array`, t => {
        const numbers = [1, 4, 8, 10];
        const a = Array.from(numbers);
        numbers.push(1);
        const c = Array.from(numbers);

        const copiedArray = deepCopyAdded(a);

        t.not(copiedArray, a);
        t.deepEqual(copiedArray, a);
        t.is(copiedArray instanceof Array, true);
        t.notDeepEqual(deepCopyAdded(a), c);
    });
};

runBaselineDeepCopyTests(deepCopy);
runBaselineDeepCopyTests(deepCopyAdded);

test(`deepCopyAdded should work for Date`, t => {
    const sourceDate = new Date();
    const copiedDate = deepCopyAdded(sourceDate);

    t.deepEqual(copiedDate, sourceDate);
});

test(`deepCopyAdded should work with RegEx`, t => {
    const sourceRegex = new RegExp(`\\w+`);
    const copiedRegex = deepCopyAdded(sourceRegex);

    t.deepEqual(copiedRegex, sourceRegex);
});

test(`deepCopyAdded should work with Set`, t => {
    const a = new Set([1, 2, 3]);
    const b = new Set([1, 2, 3]);
    const c = new Set([4]);

    t.deepEqual(deepCopyAdded(a), b);
    t.notDeepEqual(deepCopyAdded(a), c);
});

test(`deepCopyAdded should work with Map`, t => {
    const a = new Map([
        [1, 2],
        [2, 3]
    ]);
    const b = new Map([
        [1, 2],
        [2, 3]
    ]);
    const c = new Map([[4, 8]]);

    t.deepEqual(deepCopyAdded(a), b);
    t.notDeepEqual(deepCopyAdded(a), c);
});

test(`deepCopyAdded should create new set references`, t => {
    const a = new Set([1, 2, 3]);

    const result = deepCopyAdded(a);
    result.add(`I heard you paint houses`);
    result.delete(2);

    t.is(a.has(`I heard you paint houses`), false);
    t.is(a.has(2), true);
});

test(`deepCopyAdded should create new references for individual values`, t => {
    const anObject = { a: 2 };
    const set = new Set([anObject]);

    const copy = deepCopyAdded(set);
    anObject.a = 3;

    // get the first and only
    const anObjectCopy = copy.values().next().value;

    t.is(anObjectCopy.a, 2);
});

test(`deepCopyAdded should create new Map references`, t => {
    const a = new Map([
        [1, 2],
        [2, 3]
    ]);

    const result = deepCopyAdded(a);
    result.set(1, `Luke i am your father`);

    t.is(a.get(1), 2);
});

test(`deepCopyAdded should create new references for the keys of the Map`, t => {
    // Maps can have objects as keys
    const aKey = { a: 7 };
    const a = new Map([[aKey, 9]]);

    const copy = deepCopyAdded(a);
    // should not modify key of copy
    aKey.a = 12;
    aKey.b = 13;
    // get key of copy
    const aKeyCopy = copy.keys().next().value;

    t.deepEqual(aKeyCopy, { a: 7 });
});
