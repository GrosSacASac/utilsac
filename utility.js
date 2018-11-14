export {
    createDebounced,
    createThrottled,
	throttledWithLast,
    createThrottledUsingTimeout,
    createCustomRound,
    arrayWithResults,
    chainPromises,
    chainRequestAnimationFrame,
    doNTimes,
    chainPromiseNTimes,
    timeFunction,
    timePromise,
    memoizeAsStrings,
    deepCopy
};

const createDebounced = function (functionToDebounce, waitTime = 150) {
    /* creates a function that is de-bounced,
    calling it, will eventually execute it, when you stop calling it
    useful for scroll events, resize, search etc

    the returned function always returns undefined
    */
    let timeOutId = 0;
    return function(...args) {
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

const createThrottled = function (functionToThrottle, minimumTimeSpace = 150) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it once

    the returned function always returns undefined
    */
    let lastTime = Number.MIN_SAFE_INTEGER;
    return function(...args) {
        const now = Date.now();
        if (minimumTimeSpace > now - lastTime) {
            return;
        }
        lastTime = now;
        functionToThrottle(...args);
    };
};


const throttledWithLast = function (functionToThrottle, minimumTimeSpace = 150) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it twice:
	the first and last call
	The last call is always eventually executed

    the returned function always returns undefined
    */

	let timeOutId = 0;
    let lastTime = Number.MIN_SAFE_INTEGER;
    return function(...args) {
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
			}, waitTime - timeAlreadyWaited);
            return;
        }
        lastTime = now;
        functionToThrottle(...args);
    };
};

const createThrottledUsingTimeout = function (functionToThrottle, minimumTimeSpace = 150) {
    /* creates a function that is throttled,
    calling it once will execute it immediately
    calling it very often during a period less than minimumTimeSpace will only execute it once

    the returned function always return undefined
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

const arrayWithResults = function (aFunction, times) {
    /*  [].fill is for static values only

	alternative , return Array.from({length: times}, aFunction);
	same if aFunction ignores its second argument
	*/
    const array = [];
    for (let i = 0; i < times; i += 1) {
        array.push(aFunction());
    }
    return array;
};

const doNTimes = function (task, times) {
    for (let i = 0; i < times; i += 1) {
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

const chainRequestAnimationFrame = function (functions) {
    return new Promise(function (resolve, reject) {
        const values = [];
        const length = functions.length;
        let i = 0;
        const next = function (timing) {
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
                return;
            }
            resolve(values);
        };
        promiseCreator().then(chainer);
    });
};

const timeFunction = function (callback) {
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
        }).catch(reject);
    });
};

// not global because they are inside a module
const separator = "-";
const memoizeAsStrings = function (functionToMemoize) {
    /*
    todo explain better the limitations and benefits of this approach
    joins together the args as strings to compare
    false possible cache hits when "-" is inside the string
    */

	const previousResults = {};
    return function (...args) {
        const argumentsAsStrings = args.map(String).join(separator);
        /*
        without .map(String) works but undefined and null become empty strings
        const argumentsAsStrings = args.join(separator);
        */
        if (!Object.prototype.hasOwnProperty.call(previousResults, argumentsAsStrings)) {
            // not yet in cache
            previousResults[argumentsAsStrings] = functionToMemoize(...args);
        }
        return previousResults[argumentsAsStrings];
    };
};

/**
only works with undefined, null, Numbers, Symbols, Objects, Arrays,
warning does not work with cyclic objects
does not work with anything created with new
*/
const deepCopy = (x) => {
    if (!x || typeof x !== 'object') {
        return x;
    }

    if (Array.isArray(x)) {
        return x.map(cloneDeep);
    }

    const copy = {}
    for (let key in x) {
        copy[i] = cloneDeep(x[i]);
    }
    return copy;
};
