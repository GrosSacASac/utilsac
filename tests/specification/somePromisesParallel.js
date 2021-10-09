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

[1, 10].forEach(x => {
    test(`somePromisesParallel (x=${x}) returns a promise`, t => {
        t.is(typeof somePromisesParallel([promiseCreator], x).then, `function`);
    });
    
    test(`somePromisesParallel (x=${x}) with an empty array returns a promise`, t => {
        t.is(typeof somePromisesParallel([], x).then, `function`);
    });
    
    test(`somePromisesParallel (x=${x}) resolves with values Array`, async t => {
        return somePromisesParallel([promiseCreator, promiseCreator], x).then(values => {
            t.truthy(Array.isArray(values));
            values.forEach(value => {
                t.is(value, resolveValue);
            });
        });
    });
    
    test(`somePromisesParallel (x=${x}) reject with first rejecting value`, async t => {
        return somePromisesParallel([
            promiseCreator,
            rejectingPromiseCreator,
            promiseCreator,
        ], x).then((values) => {
            console.warn(values);
        }).catch(error => {
            t.is(error, rejectValue);
        });
    });
    
});
