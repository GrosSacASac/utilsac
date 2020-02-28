export {
    stringFromArrayBuffer,
    arrayBufferFromBlob,
    stringFromBlob,
    stringFromArray,
    setFromArray,
    mapFromObject,
};


const textDecoder = new TextDecoder();
const stringFromArrayBuffer = function (arrayBuffer) {
    return textDecoder.decode(arrayBuffer);
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
