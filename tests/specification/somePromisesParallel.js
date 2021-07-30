import test from "ava";
import { somePromisesParallel } from "../../utility.js";


const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};
const rejectValue = `error`;
const rejectingPromiseCreator = () => {
    return Promise.reject(rejectValue);
};

test(`somePromisesParallel returns a promise`, t => {
    t.is(typeof somePromisesParallel([promiseCreator], 1).then, `function`);
});

test(`somePromisesParallel resolves with values Array`, async t => {
    return somePromisesParallel([promiseCreator, promiseCreator], 1).then(values => {
        t.truthy(Array.isArray(values));
        values.forEach(value => {
            t.is(value, resolveValue);
        });
    });
});

test(`somePromisesParallel reject with first rejecting value`, async t => {
    return somePromisesParallel([
        promiseCreator,
        rejectingPromiseCreator,
        promiseCreator,
    ], 1).then((values) => {
        console.warn(values);
    }).catch(error => {
        t.is(error, rejectValue);
    });
});
