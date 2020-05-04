export {
    stringFromArrayBuffer,
    arrayBufferFromBlob,
    stringFromBlob,
    stringFromArray,
    setFromArray,
    mapFromObject,
};


const textDecoder = new TextDecoder();
/* works with
Uint8Array, Uint16Array, Uint32Array,
Int8Array, Int16Array, Int32Array, ArrayBuffer */
const stringFromArrayBuffer = function (arrayBufferOrView) {
    return textDecoder.decode(arrayBufferOrView);
};

const xFromBlob = function (readAs) {
    /**
     * @param {Blob | File} blob
     * @return {Promise}
     */
    return function (blob) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
            reader[readAs](blob);
        });
    };
};

const arrayBufferFromBlob = xFromBlob(`readAsArrayBuffer`);

const stringFromBlob = xFromBlob(`readAsText`);

const stringFromArray = function (array, sep = ` `) {
    return array.join(sep);
};

const setFromArray = (array) => {
    return new Set(array);
};

const mapFromObject = function (obj) {
    const m = new Map();
    for (const key in obj) {
        m.set(key, obj[key]);
    }
    return m;
};
