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
    assignSelected,
};

const timeDefault = 150;

/** creates a function that is de-bounced,
calling it, will eventually execute it, when you stop calling it
useful for scroll events, resize, search etc

the returned function always returns undefined */
const createDebounced = function (functionToDebounce, waitTime = timeDefault) {
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

/** creates a function that is throttled,
calling it once will execute it immediately
calling it very often during a period less than minimumTimeSpace will only execute it once

the returned function always returns undefined */
const createThrottled = function (functionToThrottle, minimumTimeSpace = timeDefault) {
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

/** creates a function that is throttled,
calling it once will execute it immediately
calling it very often during a period less than minimumTimeSpace will only execute it twice:
the first and last call
The last call is always eventually executed

the returned function always returns undefined */
const throttledWithLast = function (functionToThrottle, minimumTimeSpace = timeDefault) {
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

/** different than Promise.all, takes an array of functions that return a promise or value
only executes promiseCreators sequentially
resolves with an array of values or reject with the first error*/
const chainPromises = function (promiseCreators) {
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

/** forces a function that returns a promise to be sequential
useful for fs  for example */
const decorateForceSequential = function (promiseCreator) {
    let lastPromise = Promise.resolve();
    return async function (...x) {
        const promiseWeAreWaitingFor = lastPromise;
        let callback;
        // we need to change lastPromise before await anything,
        // otherwise 2 calls might wait the same thing
        lastPromise = new Promise(function (resolve) {
            callback = resolve;
        });
        await promiseWeAreWaitingFor;
        const currentPromise = promiseCreator(...x);
        currentPromise.then(callback).catch(callback);
        return currentPromise;
    };
};

/** same as chainPromises except it will run up to x amount of 
promise in parallel
resolves with an array of values or reject with the first error  **/
const somePromisesParallel = function (promiseCreators, x = 10) {

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

/** different than Promise.all
only executes promiseCreator one after the previous has resolved
useful for testing
resolves with an array of values */
const chainPromiseNTimes = function (promiseCreator, times) {
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

/** executes callback and returns time elapsed in ms */
const timeFunction = function (callback, timer = Date) {
    const startTime = timer.now();
    callback();
    const endTime = timer.now();
    return endTime - startTime;
};

/** returns a Promise that resolves with
the time elapsed for the promise to resolve and its value
executes promiseCreator and waits for it to resolve */
const timePromise = function (promiseCreator, timer = Date) {
    const startTime = timer.now();
    return promiseCreator().then(function (value) {
        const endTime = timer.now();
        return {
            timeElapsed: endTime - startTime,
            value,
        };
    });
};


/** joins together the args as strings to
decide if arguments are the same
fast memoizer
but infinitely growing */
const memoizeAsStrings = function (functionToMemoize, separator = `-`) {
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

/** creates a template tag function
that will map the provided function on all runtime values
before constructing the string
example:
const createURLString = createTemplateTag(encodeURIComponent)
createURLString`https://example.com/id/${`slashes and spaces are properly escaped ///`}`;
// -> "https://example.com/id/slashes%20and%20spaces%20are%20properly%20escaped%20%2F%2F%2F" */
const createTemplateTag = (mapper) => {
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

/** Similar to Object.assign, except it takes a white list as first argument */
const assignSelected = (list, target, ...sources) => {
    sources.forEach(source => {
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (key === `__proto__`) {
                return;
            }
            if (!list.includes(key)) {
                return;
            }
            target[key] = value;
        });
    });
    return target;
};
