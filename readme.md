# JavaScript General Purpose Utility Functions

## utilsac


## utility.js

```
    import {
        createDebounced,
        createThrottled,
		throttledWithLast,
        createCustomRound,
        arrayWithResults,
        chainPromises,
        chainRequestAnimationFrame,
        doNTimes,
        chainPromiseNTimes,
        timeFunction,
        timePromise,
        memoizeAsStrings,
        deepCopy,
        deepAssign
    } from "path.../utility.js";
```


## files.js

file-functions for node.js that return Promises


```
    import {
        textFileContent,
        writeTextInFile,
        concatenateFiles,
        copyFile,
        deleteFile
    } from "./files.js"
```


## operators.js

Common operands as functions



## random.js

```
import {
    randomPositiveInt,
    randomInt,
    randomFloat
} from "path.../random.js";
```

## blobs.js

```
    import {
        downloadBlob
    } from "path.../blobs.js";
```

## About

### License

[CC0](license.txt)

### Related

 * [fnk](https://github.com/seanohue/fnk)
 * jQuery
 * lodash
 * ramda
 * [slugify](https://github.com/sindresorhus/slugify)
