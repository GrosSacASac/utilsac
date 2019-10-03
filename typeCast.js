export {
    stringFromArrayBuffer,
    arrayBufferFromBlob,
    stringFromBlob,
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
