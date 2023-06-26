import test from "ava";
import { createThrottledPromiseCreator,createThrottledPromiseCreator2,
    createThrottledPromiseCreator3 } from "../../utility.js";
import {setTimeout as setTimeoutPromise} from "node:timers/promises"

const resolveValue = {};
const promiseCreator = () => {
    return Promise.resolve(resolveValue);
};
const rejectValue = `error`;
const rejectingPromiseCreator = () => {
    return Promise.reject(rejectValue);
};

test(`createThrottledPromiseCreator returns a promise creator`, t => {
    t.is(typeof createThrottledPromiseCreator(promiseCreator)().then, `function`);
});

test(`createThrottledPromiseCreator second call awaits for the first one if called too fast`, async t => {
    let calls = 0;
    const resolveValue = {};
    const promiseCreator = () => {
        calls += 1;
        return Promise.resolve(resolveValue);
    };
    
    const throttled = createThrottledPromiseCreator(promiseCreator);
    // const throttled = promiseCreator; // fails without decoration
    throttled();
    return throttled().then(value => {
        t.is(calls, 1);
        
    });
});

test(`createThrottledPromiseCreator second call is different if enough time passed for the second one`, async t => {
    let calls = 0;
    const resolveValue = {};
    const promiseCreator = () => {
        calls += 1;
        return Promise.resolve(resolveValue);
    };
    
    const throttled = createThrottledPromiseCreator(promiseCreator, 1);
    throttled();
    await setTimeoutPromise(2);
    return throttled().then(value => {
        t.is(calls, 2);
        
    });
});

test(`createThrottledPromiseCreator reject the same`, async t => {
    const throttled = createThrottledPromiseCreator(rejectingPromiseCreator);
    throttled();
    return throttled().catch(value => {
        t.is(value, rejectValue);
        
    });
});


test(`createThrottledPromiseCreator throttles even with different arguments`, async t => {
    let calls = 0;
    const promiseCreator = (a, b) => {
        calls += 1;
        return Promise.resolve(a + b);
    };
    
    const throttled = createThrottledPromiseCreator(promiseCreator);
    throttled(1, 2);
    throttled(2, 8);
    return throttled(2, 8).then(value => {
        t.is(calls, 1);
        t.is(value, 1 + 2);
        
    });
});

test(`createThrottledPromiseCreator2 throttles separatly with different arguments`, async t => {
    let calls = 0;
    const promiseCreator = (a, b) => {
        calls += 1;
        return Promise.resolve(a + b);
    };
    
    const throttled = createThrottledPromiseCreator2(promiseCreator);
    throttled(1, 2).then(value => {
        // t.is(calls, 1);
        t.is(value, 1 + 2);
        
    });
    throttled(2, 8);
    return throttled(2, 8).then(value => {
        t.is(calls, 2);
        t.is(value, 2 + 8);
        
    });
});

test(`createThrottledPromiseCreator3 (same test as above)`, async t => {
    let calls = 0;
    const promiseCreator = (a, b) => {
        calls += 1;
        return Promise.resolve(a + b);
    };
    
    const throttled = createThrottledPromiseCreator3(promiseCreator);
    throttled(1, 2).then(value => {
        // t.is(calls, 1);
        t.is(value, 1 + 2);
        
    });
    throttled(2, 8);
    return throttled(2, 8).then(value => {
        t.is(calls, 2);
        t.is(value, 2 + 8);
        
    });
});
