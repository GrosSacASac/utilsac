import test from "ava";
import { decorateForceSequential } from "../../utility.js";


const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};
const rejectValue = `error`;
const rejectingPromiseCreator = () => {
    return Promise.reject(rejectValue);
};

test(`decorateForceSequential returns a function`, t => {
    t.is(typeof decorateForceSequential(promiseCreator), `function`);
});

test(`decorateForceSequential returns a function that returns a promise`, t => {
    t.is(typeof decorateForceSequential(promiseCreator)().then, `function`);
});

test(`decorateForceSequential resolves with the same output as the original`, async t => {
    return decorateForceSequential(promiseCreator)().then(value => {
        t.is(value, resolveValue);
    });
});

test(`decorateForceSequential rejects with the same output as the original`, async t => {
    return decorateForceSequential(rejectingPromiseCreator)().then(() => {
    }).catch(error => {
        t.is(error, rejectValue);
    });
});
