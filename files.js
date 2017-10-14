/*files.js*/
"use strict";
const fs = require("fs");

const textFileContentPromiseFromPath = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, "utf-8", function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};

const writeTextInFilePromiseFromPathAndString = function (path, string) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, string, "utf-8", function (error, notUsed) {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};

const concatenateFiles = function (files, destination, separator=``) {
    return Promise.all(files.map(textFileContentPromiseFromPath)).then(
    function (contents) {
        return writeTextInFilePromiseFromPathAndString(destination, contents.join(separator))
    });
};  

module.exports = {
    textFileContentPromiseFromPath,
    writeTextInFilePromiseFromPathAndString,
    concatenateFiles
};
