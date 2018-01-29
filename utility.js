export {
    createDebouncedFunction,
    createThrottledFunction,
    createCustomRound,
    fillArrayWithFunctionResult,
    chainPromises,
    doNTimes,
    chainPromiseNTimes,
    timeCallback,
    timePromise,
    memoizeAsStrings
};

const createDebouncedFunction = function (functionToDebounce, waitTime) {
    /* creates a function that is de-bounced,
    calling it, will eventually execute it, when you stop calling it
    useful for scroll events, resize, search etc

    the returned function always return undefined
    
    TODO is debounced the correct word ?
    */
    let timeOutId = 0;
    return function(...args) {
        if (timeOutId > 0) {
            clearTimeout(timeOutId);
            timeOutId = 0;
        }
        timeOutId = setTimeout(function () {
            functionToDebounce(...args);
        }, waitTime);
    };
};

const createThrottledFunction = function (functionToThrottle, minimumTimeSpace) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it once

    the returned function always return undefined
    
    an alternative implementation could use Date.now() , this means less performance
    but would work for throttling inside a single long tick
    */
    let ready = true;
    const makeReady = function() {
        ready = true;
    };
    return function(...args) {
        if (!ready) {
            return;
        }
        ready = false;
        functionToThrottle(...args);
        setTimeout(makeReady, minimumTimeSpace); 
    };
};

const createCustomRound = function (precision) {
    /* creates a function similar to Math.round (has precision of 1)
    with any precision, example:
        const roundStep02 = createCustomRound(0.2);
        roundStep02(0.6125897); --> 0.6000000000000001 (rounded down)
        roundStep02(0.12); --> 0.2 (rounded up)
        roundStep02(2.4); --> 2.4000000000000004 (almost not rounded)
        roundStep02(5); --> 5 (already rounded)
    
    warning: can have small errors due to fixed precision floats */
    const halfPrecision = precision / 2;
    return function (anyNumber) {
        const rest = anyNumber % precision;
        if (rest === 0) {
            return anyNumber;
        }
        if (rest > halfPrecision) {
            return anyNumber + (precision - rest);
        }
        return anyNumber - rest;
    };
};

const fillArrayWithFunctionResult = function (aFunction, times) {
    //  [].fill is for static values only
    const returnArray = [];
    let i;
    for (i = 0; i < times; i += 1) {
        returnArray.push(aFunction());
    }
    return returnArray;
};

const doNTimes = function (task, times) {
    let i;
    for (i = 0; i < times; i += 1) {
        task();
    }
};

const chainPromises = function (promiseCreators) {
    // different than Promise.all
    // only executes promiseCreator one after the previous has resolved
    // resolves with an array of values
    const length = promiseCreators.length;
    const values = [];
    if (length === 0) {
        return Promise.resolve(values);
    }
    return new Promise(function (resolve, reject) {
        let i = 0;
        const chainer = function (value) {
            i += 1;
            values.push(value);
            if (i < length) {
                promiseCreators[i]().then(chainer);
            } else {
                resolve(values);
            }
        };
        promiseCreators[i]().then(chainer);
    });
};

const chainPromiseNTimes = function (promiseCreator, times) {
    // different than Promise.all
    // only executes promiseCreator one after the previous has resolved
    // useful for testing
    // resolves with an array of values
    
    // could be made with chainPromises, but chose not to
    // to avoid an adapter array
    const values = [];
    if (times === 0) {
        return Promise.resolve(values);
    }
    return new Promise(function (resolve, reject) {
        let i = 0;
        const chainer = function (value) {
            i += 1;
            values.push(value);
            if (i < times) {
                promiseCreator().then(chainer);
            } else {
                resolve(values);
            }
        };
        promiseCreator().then(chainer);
    });
};

const timeCallback = function (callback) {
    // executes callback and returns time elapsed in ms
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    return endTime - startTime;
};

const timePromise = function (promiseCreator) {
    // returns a Promise that resolves with
    // the time elapsed for the promise to resolve and its value
    // executes promiseCreator and waits for it to resolve
    return new Promise(function (resolve, reject) {
        const startTime = performance.now();
        promiseCreator().then(function (value) {
            const endTime = performance.now();
            resolve({
                timeElapsed: endTime - startTime,
                value
            });
        });
    });
};

const memoizeAsStrings = function (functionToMemoize) {
    /*
    todo explain better the limitations and benefits of this approach
    joins together the args as strings to compare
    false possible cache hits when "-" is inside the string
    */
    const separator = "-";
    const previousResults = {};
    return function (...args) {
        const argumentsAsStrings = args.map(String).join(separator);
        /*
        without .map(String) works but undefined and null become empty strings
        const argumentsAsStrings = args.join(separator);
        */
        if (Object.prototype.hasOwnProperty.call(previousResults, argumentsAsStrings)) {
            // cache hit
            return previousResults[argumentsAsStrings];
        }
        // not yet in cache
        const result = functionToMemoize(...args);
        // add it for later
        previousResults[argumentsAsStrings] = result;
        return result;
    };
};
