import test from "ava";
import { deepCopy } from "../../deep.js";
import { primitives } from "../helper.js";


test(`it should work like an assignement for primitives`, t => {
    primitives.forEach(value => {
        const result = deepCopy(value);
        t.is(result, value);
    });
});

test(`it should not work like an assignement for non primitives`, t => {
    const source = {
        a: 1,
    };

    const result = deepCopy(source);

    t.not(result, source);
});

test(`the result should be deep equal`, t => {
    const source = {
        a: 1,
        b: {
            c: 2,
            d: [456, 6, 8],
        },
    };

    const result = deepCopy(source);

    t.deepEqual(result, source);
});

test(`it should create new object references`, t => {
    const source = {
        a: 1,
        b: {
            c: 2,
        },
    };

    const result = deepCopy(source);
    result.b.c = 3;

    t.is(source.b.c, 2);
});
