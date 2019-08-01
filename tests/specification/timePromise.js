import test from "ava";
import { timePromise } from "../../utility.js";


const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};

test(`timePromise returns a promise`, t => {
    t.is(typeof timePromise(promiseCreator).then, `function`);
});

test(`timePromise resolves with value and time elapsed`, async t => {
    timePromise(promiseCreator).then(({ value, timeElapsed }) => {
        t.truthy(Number.isFinite(timeElapsed));
        t.is(value, resolveValue);
    });
});
