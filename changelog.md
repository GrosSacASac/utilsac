# Changelog

## 15.4.0

* add typeCastNode.js for nodejs specific casts
* add blobPromiseFromStream

## 15.3.0

* add forceThrottlePromiseCreator
* add throttlePromiseCreator
* add throttlePromiseCreatorSelfClean
* memoizeAsStrings uses JSON.stringify internally
* This change increase compatibility with function that use the objects as single argument pattern

## 15.2.0

* add assignSelected
* requires Object.hasOwn

## 15.1.0

add decorateForceSequential

## 15.0.1

deepEqualAdded will return true more often when int arrays are compared

## 15.0.0

deepEqual and deepEqualAdded will return true for objects with same content even if one has a null prototype

## 14.2.0

add somePromisesParallel, similar to chainPromises but will run up to x promises at the same time

## 14.1.0

chainPromises is more like Promise.all, promise creators can return a promise or a direct value

## 14.0.0

* memoizeAsStrings requires Map support
* chainPromiseNTimes handles rejection like Promise.all

## 13.1.0

 * How to import in deno examples

## 13.0.0

### merge blob.js and evalGlobal.js

 * merge into browserUtility.js

### safer default

 * downloadBlob default download file name does not assume the file type

## 12.4.0

### deep.js

add
 * support for type Uint8ClampedArray

## 12.3.0

add
 * deepDifference

## 12.2.0

add
 * stringFromArray
 * setFromArray
 * mapFromObject

## 12.1.0

add
 * deepEqualAdded

## 12.0.0

add
 * deepCopyAdded
 * deepAssignAdded
 * deepEqual
 * (Not yet implemented deepEqualAdded)

move
 * deepAssign
 * deepCopy

to deep.js

## 11.0.0

remove

 * createCustomRound
 * createThrottledUsingTimeout
 * arrayWithResults in favor of Array.from({length: times}, aFunction)

browse this commit #dd5fbb65b377fc4174d9444d663debfdb3f1b628
or use 10.5.5 to keep using

## 10.5.0

+typeCast

## 10.4.0

evalGlobal can be loaded as module

## 10.3.0

+evalGlobal

## 10.2.0

Support Node12 modules

## 10.1.0

+bytesLengthFromString

## 10.0.0

Split utilsac into different projects https://github.com/GrosSacASac/utilsac/issues/4
