import test from "ava";
import { chainPromiseNTimes } from "../../utility.js";


const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};
const rejectValue = `error`;
const rejectingPromiseCreator = () => {
    return Promise.reject(rejectValue);
};

test(`chainPromiseNTimes returns a promise`, t => {
    t.is(typeof chainPromiseNTimes(promiseCreator, 1).then, `function`);
});

test(`chainPromiseNTimes resolves with values Array`, async t => {
    return chainPromiseNTimes(promiseCreator, 2).then(values => {
        t.truthy(Array.isArray(values));
        values.forEach(value => {
            t.is(value, resolveValue);
        });
    });
});

test(`chainPromiseNTimes reject with first rejecting value`, async t => {
    return chainPromiseNTimes(rejectingPromiseCreator, 3).then(() => {
    }).catch(error => {
        t.is(error, rejectValue);
    });
});
