import test from "ava";
import { memoizeAsStrings } from "../../utility.js";


test(`it should retun a function`, t => {
    t.is(typeof memoizeAsStrings(Math.max), `function`);
});

test(`it should not call the function when the parameters are the same`, t => {
    let called = 0;
    // just for the test
    const sideEffectFunction = function () {
        called += 1;
    };

    const memoized = memoizeAsStrings(sideEffectFunction);
    t.is(called, 0);
    memoized();
    t.is(called, 1);
    memoized();
    t.is(called, 1);
});

test(`it should call the function when the parameters are not the same`, t => {
    let called = 0;
    const sideEffectFunction = function () {
        called += 1;
    };

    const memoized = memoizeAsStrings(sideEffectFunction);
    t.is(called, 0);
    memoized(1);
    t.is(called, 1);
    memoized(2);
    t.is(called, 2);
});

test(`it should return the same when when the parameters are the same`, t => {
    const sideEffectFunction = function () {
        return {};
    };

    const memoized = memoizeAsStrings(sideEffectFunction);
    const result1 = memoized(1);
    const result2 = memoized(2);
    const result3 = memoized(1);
    t.is(result1, result3);
    t.not(result1, result2);
});
