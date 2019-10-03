export {
  deepEqual
};

/**
  * Determines whether two objects are equal. Works on nested structures.
  * @param {Object} obj1 can be either an object or array
  * @param {Object} obj2 can be either an object or array
  * @returns {Boolean}
  */

const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) { // check primative
    return true;
  }

  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2)) {
      return false;
    }

    if (obj1.length !== obj2.length) {
      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  } else if (isObject(obj1) && obj1 !== null) {
    const keysA = Object.keys(obj1);
    const keysB = Object.keys(obj2);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const prop in obj1) {
      if (obj2.hasOwnProperty(prop)) {
        if (!deepEqual(obj1[prop], obj2[prop])) {
          return false;
        }
      }
    }
    return true;
  }
};

const isObject = obj => obj === Object(obj);
