export {
    createDebounced,
    createThrottled,
    throttledWithLast,
    chainPromiseNTimes,
    chainPromises,
    somePromisesParallel,
    chainRequestAnimationFrame,
    decorateForceSequential,
    doNTimes,
    timeFunction,
    timePromise,
    memoizeAsStrings,
    createTemplateTag,
    bytesLengthFromString,
};

const timeDefault = 150;

const createDebounced = function (functionToDebounce, waitTime = timeDefault) {
    /* creates a function that is de-bounced,
    calling it, will eventually execute it, when you stop calling it
    useful for scroll events, resize, search etc

    the returned function always returns undefined */
    let timeOutId = 0;
    return function (...args) {
        if (timeOutId !== 0) {
            clearTimeout(timeOutId);
            timeOutId = 0;
        }
        timeOutId = setTimeout(function () {
            timeOutId = 0;
            functionToDebounce(...args);
        }, waitTime);
    };
};

const createThrottled = function (functionToThrottle, minimumTimeSpace = timeDefault) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it once

    the returned function always returns undefined */
    let lastTime = Number.MIN_SAFE_INTEGER;
    return function (...args) {
        const now = Date.now();
        if (minimumTimeSpace > now - lastTime) {
            return;
        }
        lastTime = now;
        functionToThrottle(...args);
    };
};

const throttledWithLast = function (functionToThrottle, minimumTimeSpace = timeDefault) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it twice:
    the first and last call
    The last call is always eventually executed

    the returned function always returns undefined */

    let timeOutId = 0;
    let lastTime = Number.MIN_SAFE_INTEGER;
    return function (...args) {
        const now = Date.now();
        const timeAlreadyWaited = now - lastTime;
        if (timeOutId !== 0) {
            clearTimeout(timeOutId);
            timeOutId = 0;
        }
        if (minimumTimeSpace > timeAlreadyWaited) {
            timeOutId = setTimeout(function () {
                timeOutId = 0;
                lastTime = now;
                functionToThrottle(...args);
            }, minimumTimeSpace - timeAlreadyWaited);
            return;
        }
        lastTime = now;
        functionToThrottle(...args);
    };
};

const doNTimes = function (task, times) {
    for (let i = 0; i < times; i += 1) {
        task();
    }
};

const chainPromises = function (promiseCreators) {
    /* different than Promise.all, takes an array of functions that return a promise or value
    only executes promiseCreators sequentially
    resolves with an array of values or reject with the first error*/
    const {length} = promiseCreators;
    const values = [];
    let i = -1;
    return new Promise(function (resolve, reject) {
        const chainer = function (value) {
            i += 1;
            if (i > 0) {
                values.push(value);
            }
            if (i < length) {
                Promise.resolve(promiseCreators[i]()).then(chainer).catch(reject);
            } else {
                resolve(values);
            }
        };
        chainer();
    });
};



const decorateForceSequential = function (promiseCreator) {
    /* forces a function that returns a promise to be sequential
    useful for fs  for example */
    let lastPromise = Promise.resolve();
    return async function (...x) {
        await lastPromise;
        lastPromise = promiseCreator(...x);
        return lastPromise;
    }
};


const somePromisesParallel = function (promiseCreators, x = 10) {
    /* same as chainPromises except it will run up to x amount of 
    promise in parallel */
    const {length} = promiseCreators;
    const values = [];
    let i = -1;
    let completed = 0;
    let hasErrored = false;
    return new Promise(function (resolve, reject) {
        const chainer = function (isLaunching, lastValue, index) {
            i += 1;
            if (!isLaunching) {
                values[index] = lastValue;
                completed += 1;
            }
            if (i < length) {
                const currentIndex = i;
                Promise.resolve(promiseCreators[i]()).then(function (value) {
                    chainer(false, value, currentIndex);
                }).catch(function (error) {
                    if (!hasErrored) {
                        hasErrored = true;
                        reject(error);
                    }
                });
            } else {
                if ((completed === length) && !hasErrored) {
                    resolve(values);
                }
            }
        };
        // call at least once (for empty array)
        chainer(true);
        for (let y = 0; y < x && y < length - 1; y += 1) {
            chainer(true);
        }
    });
};

const chainPromiseNTimes = function (promiseCreator, times) {
    /* different than Promise.all
    only executes promiseCreator one after the previous has resolved
    useful for testing
    resolves with an array of values */
    return chainPromises(Array.from({length: times}).fill(promiseCreator));
};

const chainRequestAnimationFrame = function (functions) {
    return new Promise(function (resolve, reject) {
        const values = [];
        const {length} = functions;
        let i = 0;
        const next = function () {
            if (i < length) {
                try {
                    values.push(functions[i]());
                } catch (error) {
                    reject(error);
                    return;
                }
                i += 1;
                requestAnimationFrame(next);
            } else {
                resolve(values);
            }
        };
        next();
    });
};

const timeFunction = function (callback, timer = Date) {
    // executes callback and returns time elapsed in ms
    const startTime = timer.now();
    callback();
    const endTime = timer.now();
    return endTime - startTime;
};

const timePromise = function (promiseCreator, timer = Date) {
    /* returns a Promise that resolves with
    the time elapsed for the promise to resolve and its value
    executes promiseCreator and waits for it to resolve */
    const startTime = timer.now();
    return promiseCreator().then(function (value) {
        const endTime = timer.now();
        return {
            timeElapsed: endTime - startTime,
            value,
        };
    });
};


const memoizeAsStrings = function (functionToMemoize, separator = `-`) {
    /* joins together the args as strings to
    decide if arguments are the same
    fast memoizer
    but infinitely growing */

    const previousResults = new Map();
    return function (...args) {
        const argumentsAsStrings = args.map(String).join(separator);
        /*
        without .map(String) works but undefined and null become empty strings
        const argumentsAsStrings = args.join(separator);
        */
        if (!previousResults.has(argumentsAsStrings)) {
            // not yet in cache
            previousResults.set(argumentsAsStrings, functionToMemoize(...args));
        }
        return previousResults.get(argumentsAsStrings);
    };
};


const createTemplateTag = (mapper) => {
    /* creates a template tag function
    that will map the provided function on all runtime values
    before constructing the string
    example:
    const createURLString = createTemplateTag(encodeURIComponent)
    createURLString`https://example.com/id/${`slashes and spaces are properly escaped ///`}`;
    // -> "https://example.com/id/slashes%20and%20spaces%20are%20properly%20escaped%20%2F%2F%2F" */
    return (staticStrings, ...parts) => {
        return Array.from(parts, (part, index) => {
            return `${staticStrings[index]}${mapper(part)}`;
        }).concat(staticStrings[staticStrings.length - 1]).join(``);
    };
};

const textEncoder = new TextEncoder();
const bytesLengthFromString = string => {
    return textEncoder.encode(string).length;
};
