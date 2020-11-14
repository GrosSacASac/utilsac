# Utility functions

## Installation

[`npm i utilsac`](https://www.npmjs.com/package/utilsac)

## Usage

## utility.js

```js
import {
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
    createTemplateTag,
    bytesLengthFromString,
} from "utilsac";
```


## deep.js

```js
import {
    deepCopy,
    deepCopyAdded,
    deepAssign,
    deepAssignAdded,
    deepEqual,
    deepEqualAdded,
    deepDifference,
} from "utilsac/deep.js";
```


### deepEqual example

```js 
const personA = { email: 'example@email.com', name: { firstname: 'James', lastname: 'William' }};

const personB = { email: 'example@email.com', name: { firstname: 'James', lastname: 'William' }};

deepEqual(personA, personB); //  true
```


## typeCast.js

```js
import {
    stringFromArrayBuffer,
    arrayBufferFromBlob,
    stringFromBlob,
    stringFromArray,
    setFromArray,
    mapFromObject,
} from "utilsac/typeCast.js";
```


## browserUtility.js

```js
import { 
    evalGlobal,
    downloadBlob,
} from "utilsac/browserUtility.js";
```

```js
evalGlobal(`window.x = 2 ** 10`);
```

After the Promise is resolved the code has executed in global scope.


```js
evalGlobal(`
import sin form "./x.js";
window.x = sin(Math.PI)
`, `module`);
```

Use optional second argument with `module` to be able to use static imports




## About

### Changelog

[Changelog](./changelog.md)


### License

[CC0](./license.txt)

### Related

 * [JSON.prune to handle circular objects](https://github.com/Canop/JSON.prune)
 * [stackoverflow answer to clone prototypes](https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)
 * [fnk utility functions](https://github.com/seanohue/fnk)
 * [lodash utility functions](https://lodash.com/)
