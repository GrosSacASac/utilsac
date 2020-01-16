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
warning
does not work with cyclic objects
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
like deepCopy but supports more types
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

warning
does not work with cyclic object
does not copy internal links

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
warning
does not work with cyclic objects
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
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

warning
does not work with cyclic objects
does not copy internal links

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
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,

 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqual = (a, b) => {
    if (a === b) {
        return true;
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        return a.every((value, index) => {
            return deepEqual(value, b[index]);
        });
    }

    if (a.constructor !== b.constructor) {
        return false;
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

/**
works with
undefined, null, Number, Symbol, String, Big Int,
Object, Array,
Date, RegExp, Set, Map,
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array

 * @param {Object} a can be either an object or array
 * @param {Object} b can be either an object or array
 * @returns {Boolean}
 */
const deepEqualAdded = (a, b) => {
    if (a === b) {
        return true;
    }

    if (a instanceof Date) {
        if (!(b instanceof Date)) {
            return false;
        }
        return (a.getTime() === b.getTime());
    }

    if (a instanceof RegExp) {
        if (!(b instanceof RegExp)) {
            return false;
        }
        return String(a) === String(b);
    }

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        return validateArrayLike(a, b);
    }


    if ((a instanceof Uint8Array) ||
        (a instanceof Uint16Array) ||
        (a instanceof Uint32Array) ||
        (a instanceof Int8Array) ||
        (a instanceof Int16Array) ||
        (a instanceof Int32Array)) {
        if (!(b instanceof a.constructor)) {
            return false;
        }
        return validateArrayLike(arr1, arr2);
    }

    if ((a instanceof Set)) {
        if (!(b instanceof Set)) {
            return false;
        }
        
        // Sets have size, not length
        const arr1 = Array.from(a);
        const arr2 = Array.from(b);
        return validateArrayLike(arr1, arr2);
    }

    if (a instanceof Map) {
        if (!(b instanceof Map)) {
            return false;
        }

        if (a.size !== b.size) {
            return false;
        }

        const keysA = a.keys();
        for (const key of keysA) {
            // todo don't check for strict equal key, use deepEqual
            if (!b.has(key) || !deepEqualAdded(a.get(key), b.get(key))) {
                return false;
            }
        }
        return true;
    }

    if (a.constructor !== b.constructor) {
        return false;
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

const isObject = x => {
    return typeof x === `object` && x !== null;
};

const validateArrayLike = (a, b) => {
    return (
        (a.length === b.length) &&
        (a.every((value, index) => {
            return deepEqualAdded(value, b[index]);
        }))
    );
};
