import test from "ava";
import { deepEqual, deepEqualAdded } from "../../deep.js";


const runBaselineDeepEqualTests = (deepEqualImplementation) => {
    const { name } = deepEqualImplementation;
    test(`${name} should pass if objects have the same contents`, t => {
        const obj1 = {
            'a': 1,
            'b': 2,
            'c': `hi`,
        };
        const obj2 = {
            'a': 1,
            'b': 2,
            'c': `hi`,
        };
        t.is(deepEqualImplementation(obj1, obj2), true);
    });

    test(`${name} should fail if objects do not have the same contents`, t => {
        const obj1 = {
            'a': 1,
            'b': 2,
            'c': `hi`,
        };
        const obj2 = {
            'a': 1,
            'b': 2,
            'c': `bye`,
        };
        t.is(deepEqualImplementation(obj1, obj2), false);
    });

    test(`${name} should pass if object with nested properties are equal`, t => {
        const obj1 = {
            'a': 1,
            'b': {
                'b1': 16,
                'c2': {
                    'd3': {
                        'e4': true,
                    },
                },
            },
            'c': 3,
        };
        const obj2 = {
            'a': 1,
            'b': {
                'b1': 16,
                'c2': {
                    'd3': {
                        'e4': true,
                    },
                },
            },
            'c': 3,
        };
        t.is(deepEqualImplementation(obj1, obj2), true);
    });

    test(`${name} should fail if mismatched arrays are not equal`, t => {
        const arr1 = [1, 2, 3, 5];
        const arr2 = [1, 2, 3, 4];
        t.is(deepEqualImplementation(arr1, arr2), false);
    });

    test(`${name} should pass if arrays contain the same contents`, t => {
        const arr1 = [1, 2, 3, 5];
        const arr2 = [1, 2, 3, 5];
        t.is(deepEqualImplementation(arr1, arr2), true);
    });

    test(`${name} should fail if object with arrays are not equal`, t => {
        const obj1 = {
            'a': 1,
            'b': [16, 10],
            'c': 3,
        };
        const obj2 = {
            'a': 1,
            'b': [16, 11],
            'c': 3,
        };
        t.is(deepEqualImplementation(obj1, obj2), false);
    });

    test(`${name} should pass if object with arrays are equal`, t => {
        const obj1 = {
            'a': 1,
            'b': [16, 11, 2],
            'c': `hi`,
        };
        const obj2 = {
            'a': 1,
            'b': [16, 11, 2],
            'c': `hi`,
        };
        t.is(deepEqualImplementation(obj1, obj2), true);
    });

    test(`${name} should pass if object with arrays of objects should be equal`, t => {
        const obj1 = {
            'a': [1, 3, 5],
            'b': [{ 'b1': 16 }, { 'c1': 10 }],
            'c': `hi`,
            'd': [{ 'd1': [1, 2, 3], 'd2': [4, 5, 6] }],
        };
        const obj2 = {
            'a': [1, 3, 5],
            'b': [{ 'b1': 16 }, { 'c1': 10 }],
            'c': `hi`,
            'd': [{ 'd1': [1, 2, 3], 'd2': [4, 5, 6] }],
        };
        t.is(deepEqualImplementation(obj1, obj2), true);
    });

    test(`${name} should handle undefined values`, t => {
        const a = { 'value': undefined };
        const b = { 'value': undefined };
        t.is(deepEqualImplementation(a, b), true);
    });

    test(`${name} should not consider array and array-like object as equal `, t => {
        const a = {
            0: `a`,
            1: `b`,
        };
        const b = [
            `a`,
            `b`,
        ];
        t.is(deepEqualImplementation(a, b), false);
    });

    
    test(`${name} should pass if objects have slightly different prototypes`, t => {
        const obj1 = {
            'a': 1,
            'b': 2,
            'c': `hi`,
        };
        const obj2 = Object.assign(Object.create(null), {
            'a': 1,
            'b': 2,
            'c': `hi`,
        });
        t.is(deepEqualImplementation(obj1, obj2), true);
    });
};


runBaselineDeepEqualTests(deepEqual);
runBaselineDeepEqualTests(deepEqualAdded);


test(`deepEqualAdded should handle Set`, t => {
    const a = new Set([1, 2, 3]);
    const b = new Set([1, 2, 3]);
    const c = new Set([4]);
    t.is(deepEqualAdded(a, b), true);
    t.is(deepEqualAdded(a, c), false);
});

test(`deepEqualAdded should handle Map`, t => {
    const a = new Map([[1, 2], [2, 3]]);
    const b = new Map([[1, 2], [2, 3]]);
    const c = new Map([[4, 8]]);
    t.is(deepEqualAdded(a, b), true);
    t.is(deepEqualAdded(a, c), false);
});

test(`deepEqualAdded should handle RegExp`, t => {
    const a = /abc/;
    const b = /abc/;
    const c = /xyz/;
    t.is(deepEqualAdded(a, b), true);
    t.is(deepEqualAdded(a, c), false);
});

test(`deepEqualAdded should handle Dates`, t => {
    const a = new Date();
    const b = new Date();
    const commonTime = 10 ** 12;
    a.setTime(commonTime);
    b.setTime(commonTime);
    const c = new Date();
    c.setTime(commonTime + 1);
    t.is(deepEqualAdded(a, b), true);
    t.is(deepEqualAdded(a, c), false);
});


test(`deepEqualAdded should pass for array of Dates`, t => {
    const arr1 = Array.from([new Date(`2019-01-01`),new Date(`2019-01-02`), new Date(`2019-01-03`)]);
    const arr2 = Array.from([new Date(`2019-01-01`),new Date(`2019-01-02`), new Date(`2019-01-03`)]);
    t.true(deepEqualAdded(arr1, arr2));
});

test(`deepEqualAdded should fail for array of Dates given different dates`, t => {
    const arr1 = Array.from([new Date(`2019-01-01`),new Date(`2019-01-02`), new Date(`2019-01-03`)]);
    const arr2 = Array.from([new Date(`2019-01-02`),new Date(`2019-01-02`), new Date(`2019-01-03`)]);
    t.false(deepEqualAdded(arr1, arr2));
});

test(`deepEqualAdded should fail for Map of Dates given mismatched data`, t => {
    const a = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Date(`2019-01-02`)],
        [`c`, new Date(`2019-01-06`)],
    ]);
    const b = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Date(`2019-01-01`)],
        [`g`, new Date(`2019-01-03`)],
    ]);
    t.false(deepEqualAdded(a, b));
});

test(`deepEqualAdded should pass for nested Map of Dates`, t => {
    const a = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Map([
            [ `b1`, new Date(`2019-01-05`)],
            [ `c1`, new Date(`2019-01-06`)],
            [ `d1`, new Date(`2019-01-07`)]]),
        ],
        [`c`, new Date(`2019-01-06`)],
    ]);
    const b = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Map([
            [ `b1`, new Date(`2019-01-05`)],
            [ `c1`, new Date(`2019-01-06`)],
            [ `d1`, new Date(`2019-01-07`)]]),
        ],
        [`c`, new Date(`2019-01-06`)],
    ]);
    t.true(deepEqualAdded(a, b));
});
test(`deepEqualAdded should pass for Map of Dates`, t => {
    const a = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Date(`2019-01-02`)],
        [`c`, new Date(`2019-01-03`)],
    ]);
    const b = new Map([
        [`a`, new Date(`2019-01-01`)],
        [`b`, new Date(`2019-01-02`)],
        [`c`, new Date(`2019-01-03`)],
    ]);
    t.true(deepEqualAdded(a, b));
});

[
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Int8Array,
    Int16Array,
    Int32Array,
].forEach((intArrayType) => {
    test(`deepEqualAdded should handle typed ${intArrayType.name} Arrays`, t => {
        const numbers = [1, 4, 8, 10];
        const a = new intArrayType(numbers);
        const b = new intArrayType(numbers);
        numbers.push(1);
        const c = new intArrayType(numbers);
    
        t.is(deepEqualAdded(a, b), true);
        t.is(deepEqualAdded(a, c), false);
    });
});


[
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Int8Array,
    Int16Array,
    Int32Array,
].forEach((intArrayType) => {
    test(`deepEqualAdded should handle not care if ${intArrayType.name} is compared with a subcclass`, t => {
        const SubClass = class extends intArrayType {};
        const numbers = [1, 4, 8, 10];
        const a = new intArrayType(numbers);
        const b = new SubClass(numbers);
    
        t.is(deepEqualAdded(a, b), true);
        t.is(deepEqualAdded(b, a), true); // order should not matter
    });
});
