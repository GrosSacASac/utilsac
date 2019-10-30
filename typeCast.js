export {
    stringFromArrayBuffer,
    arrayBufferFromBlob,
    stringFromBlob,
    stringFromArray,
    setFromArray,
    mapFromObject,
};


const stringFromArrayBuffer = function (arrayBuffer, encoding = `utf-8`) {
    return (new TextDecoder(encoding)).decode(new DataView(arrayBuffer));
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
    return array.reduce((total, item) => `${total}${sep}${item}`);
}

const setFromArray = (array) => new Set(array);

const mapFromObject = function (obj) {
    let m = new Map();
    for (let key in obj) {
        m.set(key, obj[key]);
    }
    return m;
}