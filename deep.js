export {
    deepCopy,
    deepCopyAdded,
    deepAssign,
    deepAssignAdded,
    deepEqual,
    deepEqualAdded,
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

    const copy = {};
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
    if (ArrayBuffer.isView(x) && !(x instanceof DataView)) {
        return new x.constructor(x);
    }

    const copy = {};
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
                target[key] = new Set(tempArray);
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
                value.forEach((intlValue, intlKey) => {
                    map.set(deepCopyAdded(intlKey), deepCopyAdded(intlValue));
                });
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
                target[key] = new value.constructor(value);
                return;
            }
            // value is an Object
            if (typeof target[key] !== `object` || !target[key]) {
                target[key] = {};
            }
            deepAssignAdded(target[key], value);
        });
    });
    return target;
};

/**
 * Determines whether two objects are equal. Works on nested structures.
 * Work with all primitive types like Number, String, Big Int.
 * It also works when nested structure contains object and array
 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqual = (a, b) => {
    if (a === b) {
        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        return a.every((value, index) => {
            return deepEqual(value, b[index]);
        });
    }
    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        return (
            deepEqual(keysA, keysB) &&
            keysA.every(key => {
                return deepEqual(a[key], b[key]);
            })
        );
    }
    return false;
};

const isObject = x => {
    return typeof x === `object` && x !== null;
};

const validateArray = (a,b) => {
    if (a === null && b === null) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    return a.every((value, index) => {
        return deepEqualAdded(value, b[index]);
    });
};

/**
 * Determines whether two objects are equal. Works on nested structures.
 * Work with all primitive types like Number, String, Big Int.
 * It also Object, Array, Date and Regex
 * It also works when nested structure contains object and array
 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqualAdded = (a, b) => {
    if (a === b) {
        return true;
    }

    if (a instanceof Date && b instanceof Date) {
        return deepEqualAdded(a.getTime(), b.getTime());
    }

    if (a instanceof RegExp && b instanceof RegExp) {
        return new RegExp(a).toString() === new RegExp(b).toString();
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        return validateArray(a, b);
    }

    if ((a instanceof Uint8Array && b instanceof Uint8Array)
        || (a instanceof Uint16Array && b instanceof Uint16Array)
        || (a instanceof Set && b instanceof Set)) {
        const arr1 = Array.from(a);
        const arr2 = Array.from(b);
        return validateArray(arr1, arr2);
    }

    if (a instanceof Map && b instanceof Map) {
        const keysA = a.keys();
        const keysB = b.keys();

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!b.has(key) || !deepEqualAdded(a.get(key), b.get(key))) {
                return false;
            }
        }
        return true;
    }

    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        return (
            deepEqualAdded(keysA, keysB) &&
            keysA.every(key => {
                return deepEqualAdded(a[key], b[key]);
            })
        );
    }

    return false;
};
