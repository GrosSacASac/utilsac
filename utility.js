export {
    createDebounced,
    createThrottled,
    throttledWithLast,
    chainPromises,
    chainRequestAnimationFrame,
    doNTimes,
    chainPromiseNTimes,
    timeFunction,
    timePromise,
    memoizeAsStrings,
    deepCopy,
    deepCopyAdded,
    deepAssign,
    deepAssignAdded,
    createTemplateTag,
    bytesLengthFromString,
};

const createDebounced = function (functionToDebounce, waitTime = 150) {
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

const createThrottled = function (functionToThrottle, minimumTimeSpace = 150) {
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


const throttledWithLast = function (functionToThrottle, minimumTimeSpace = 150) {
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
            }, waitTime - timeAlreadyWaited);
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
    /* different than Promise.all, takes an array of functions that return a promise
    only executes promiseCreators sequentially
    resolves with an array of values or reject with the first error*/
    const length = promiseCreators.length;
    const values = [];
    let i = -1;
    return new Promise(function (resolve, reject) {
        const chainer = function (value) {
            i += 1;
            if (i > 0) {
                values.push(value);
            }
            if (i < length) {
                const promise = promiseCreators[i]();
                promise.then(chainer);
                promise.catch(reject);
            } else {
                resolve(values);
            }
        };
        chainer();
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
    /* different than Promise.all
    only executes promiseCreator one after the previous has resolved
    useful for testing
    resolves with an array of values

    could be made with chainPromises, but chose not to
    to avoid an adapter array */
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
            value
        };
    });
};


const memoizeAsStrings = function (functionToMemoize, separator = `-`) {
    /* joins together the args as strings to
    decide if arguments are the same
    fast memoizer
    but infinitely growing */

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
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning does not work with cyclic object, Date, regex
does not work with anything created with new
*/
const deepCopy = x => {
    if (typeof x !== `object` || x === null) {
        return x;
    }

    if (Array.isArray(x)) {
        return x.map(deepCopy);
    }

    const copy = {}
    Object.entries(x).forEach(([key, value]) => {
        copy[key] = deepCopy(value);
    });

    return copy;
};

/**
todo
like deepCopy but supports more types
only works with
undefined, null, Number, Symbol, String, Big Int, Object, Array, Date, RegExp, Set, Map
warning does not work with cyclic object
does not work with anything created with new
*/
const deepCopyAdded = x => {
    if (typeof x !== `object` || x === null) {
        return x;
    }
    if (x instanceof Date) {
        return new Date(x);
    }
    if (x instanceof RegExp) {
        return new RegExp(x);
    }
    if (x instanceof Set) {
        return new Set(Array.from(x, deepCopyAdded));
    }
    if (x instanceof Map) {
        const map = new Map();
        // todo keep internal links
        x.forEach((value, key) => {
            map.set(deepCopyAdded(key), deepCopyAdded(value));
        });
        return map;
    }
    if (Array.isArray(x)) {
        return x.map(deepCopy);
    }

    const copy = {}
    Object.entries(x).forEach(([key, value]) => {
        copy[key] = deepCopy(value);
    });

    return copy;
};


/**
Like Object.assign but deep,
does not try to assign partial arrays inside, they are overwritten
only works with undefined, null, Number, Symbol, String, Big Int, Object, Array,
warning does not work with cyclic object, Date, regex
does not work with anything created with new

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssign = (target, ...sources) => {
    sources.forEach(source => {
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (key === `__proto__`) {
                return;
            }
            if (typeof value !== `object` || value === null) {
                target[key] = value;
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            // value is an Object
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            deepAssign(target[key], value);
        });
    });
    return target;
};


/**
Like deepAssign but supports more types,
does not try to assign partial arrays inside, they are overwritten
only works with
undefined, null, Number, Symbol, String, Big Int, Object, Array, Date, Set, Map, RegExp
warning does not work with cyclic objects

@param {Object} target must be an object
@param {Object} source1 should be an object, silently discards if not (like Object.assign)

@return {Object} target
*/
const deepAssignAdded = (target, ...sources) => {
    sources.forEach(source => {
        if (!source || typeof source !== `object`) {
            return;
        }
        Object.entries(source).forEach(([key, value]) => {
            if (key === `__proto__`) {
                return;
            }
            if (typeof value !== `object` || value === null) {
                target[key] = value;
                return;
            }
            if (value instanceof Date) {
                target[key] = new Date(value);
                return;
            }
            if (value instanceof RegExp) {
                target[key] = new RegExp(value);
                return;
            }
            if (value instanceof Set) {
                let tempArray = Array.from(value, deepCopyAdded);
                if (target[key] instanceof Set) {
                    tempArray = tempArray.concat(Array.from(target[key]));
                }
                target[key] = new Set(Array.from(value, deepCopyAdded));
                return;
            }
            if (value instanceof Map) {
                let map;
                if (target[key] instanceof Map) {
                    map = target[key];
                } else {
                    map = new Map();
                    target[key] = map;
                }
                // todo keep internal links
                value.forEach((value, key) => {
                    map.set(deepCopyAdded(key), deepCopyAdded(value));
                });
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            // value is an Object
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            deepAssign(target[key], value);
        });
    });
    return target;
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
            return `${staticStrings[index]}${mapper(part)}`
        }).concat(staticStrings[staticStrings.length - 1]).join(``);
    };
};


const bytesLengthFromString = string => {
    const textEncoder = new TextEncoder();
    return textEncoder.encode(string).length;
};
