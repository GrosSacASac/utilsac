import test from "ava";
import { chainPromises } from "../../utility.js";


const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};
const rejectValue = "error"
const rejectingPromiseCreator = () => {
    return Promise.reject(rejectValue);
};

test(`timePromise returns a promise`, t => {
    t.is(typeof chainPromises([promiseCreator]).then, `function`);
});

test(`timePromise resolves with values Array`, async t => {
    return chainPromises([promiseCreator, promiseCreator]).then(values => {
        t.truthy(Array.isArray(values));
        values.forEach(value => {
            t.is(value, resolveValue);
        });
    });
});

test(`timePromise reject with first rejecting value`, async t => {
    return chainPromises([
        promiseCreator,
        rejectingPromiseCreator,
        promiseCreator
    ]).then(() => {
    }).catch(error => {
        t.is(error, rejectValue);
    });
});
